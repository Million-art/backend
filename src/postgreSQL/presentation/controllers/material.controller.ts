import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMaterialUseCase } from '../../application/use-cases/materials/create-material.usecase';
import { GetMaterialsWithFiltersUseCase } from '../../application/use-cases/materials/get-materials-with-filters.usecase';
import { GetMaterialUseCase } from '../../application/use-cases/materials/get-material.usecase';
import { UpdateMaterialUseCase } from '../../application/use-cases/materials/update-material.usecase';
import { DeleteMaterialUseCase } from '../../application/use-cases/materials/delete-material.usecase';
import { CreateMaterialDto } from '../dto/material/create-material.dto';
import { UpdateMaterialDto } from '../dto/material/update-material.dto';
import { MaterialMapper } from '../dto/mappers/material.mapper';
import { MaterialResponseDto } from '../dto/material/material-response.dto';
import { Difficulty } from '../../domain/interfaces/enums/material.enum';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/auth/guards/roles.guard';
import { RequireRoles } from '../../../shared/auth/decorators/roles.decorator';
import { Roles } from '../../domain/interfaces/enums/user.enum';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';
import { multerConfig } from '../../../shared/upload/multer.config';

@ApiTags('materials')
@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaterialController {
  constructor(
    private readonly createMaterialUseCase: CreateMaterialUseCase,
    private readonly getMaterialUseCase: GetMaterialUseCase,
    private readonly getMaterialsWithFiltersUseCase: GetMaterialsWithFiltersUseCase,
    private readonly updateMaterialUseCase: UpdateMaterialUseCase,
    private readonly deleteMaterialUseCase: DeleteMaterialUseCase,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.MODERATOR, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create a new material',
    description: 'Creates a new educational material with file upload support, categorization, and status management. Materials can be PDFs, videos, images, documents, links, or presentations.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Material created successfully', 
    type: MaterialResponseDto,
    headers: {
      'Location': {
        description: 'URL of the created material',
        schema: { type: 'string', example: '/materials/123e4567-e89b-12d3-a456-426614174000' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid material data provided' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Validation error - Check request body for validation errors' 
  })
  async create(@Body() dto: CreateMaterialDto): Promise<MaterialResponseDto> {
    const material = await this.createMaterialUseCase.execute(dto);
    return MaterialMapper.toResponseDto(material);
  }

  @Post('upload')
  @RequireRoles(Roles.ADMIN, Roles.MODERATOR, Roles.SUPERADMIN)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ 
    summary: 'Upload a material file',
    description: 'Uploads a file to Cloudinary and returns the file information for creating a material'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        public_id: { type: 'string' },
        secure_url: { type: 'string' },
        original_filename: { type: 'string' },
        format: { type: 'string' },
        resource_type: { type: 'string' },
        bytes: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid file or material type' 
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!type) {
      throw new BadRequestException('Material type is required');
    }

    // Validate material type
    const validTypes = ['pdf', 'video', 'image', 'document', 'presentation'];
    if (!validTypes.includes(type)) {
      throw new BadRequestException(`Invalid material type: ${type}. Valid types are: ${validTypes.join(', ')}`);
    }

    // Validate file type based on material type
    const allowedMimeTypes = {
      pdf: ['application/pdf'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      document: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf',
      ],
      presentation: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
    };

    if (!allowedMimeTypes[type].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type for ${type}. Allowed types: ${allowedMimeTypes[type].join(', ')}. Received: ${file.mimetype}`
      );
    }

    try {
      const result = await this.cloudinaryService.uploadFile(file, type);
      return result;
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  @Get()
  @RequireRoles(Roles.ADMIN, Roles.MODERATOR, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Get all materials',
    description: 'Retrieves a paginated list of materials with optional filtering and search capabilities. Results are ordered by creation date (newest first).'
  })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    description: 'Filter materials by category',
    example: 'mathematics',
    schema: { type: 'string' }
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Filter materials by type',
    example: 'pdf',
    schema: { type: 'string' }
  })
  @ApiQuery({ 
    name: 'difficulty', 
    required: false, 
    enum: Difficulty, 
    description: 'Filter materials by difficulty level',
    example: Difficulty.MEDIUM
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Search materials by title or description (case-insensitive)',
    example: 'calculus',
    schema: { type: 'string' }
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number for pagination (default: 1)',
    example: 1,
    schema: { type: 'integer', minimum: 1 }
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
    schema: { type: 'integer', minimum: 1, maximum: 100 }
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    description: 'Field to sort by',
    example: 'createdAt',
    enum: ['createdAt', 'title', 'viewCount']
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved paginated list of materials', 
    schema: {
      type: 'object',
      properties: {
        materials: {
          type: 'array',
          items: { $ref: '#/components/schemas/MaterialResponseDto' }
        },
        total: { type: 'integer', description: 'Total number of materials' },
        page: { type: 'integer', description: 'Current page number' },
        limit: { type: 'integer', description: 'Items per page' },
        totalPages: { type: 'integer', description: 'Total number of pages' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid query parameters' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async getAll(
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<any> {
    const filterOptions = {
      category,
      type,
      difficulty,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as any,
      sortOrder,
    };

    const result = await this.getMaterialsWithFiltersUseCase.execute(filterOptions);
    
    return {
      materials: MaterialMapper.toResponseDtoList(result.materials),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get material by ID',
    description: 'Retrieves a specific material by its unique identifier. Returns complete material details including metadata and analytics.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the material',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Material found successfully', 
    type: MaterialResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Material not found - The specified material ID does not exist' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid material ID format' 
  })
  async getById(@Param('id') id: string): Promise<MaterialResponseDto> {
    const material = await this.getMaterialUseCase.execute(id);
    return MaterialMapper.toResponseDto(material);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update material by ID',
    description: 'Updates an existing material with new data. All fields are optional - only provided fields will be updated. File uploads require separate handling.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the material to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Material updated successfully', 
    type: MaterialResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Material not found - The specified material ID does not exist' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Validation error - Check request body for validation errors' 
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialDto,
  ): Promise<MaterialResponseDto> {
    const material = await this.updateMaterialUseCase.execute(id, dto);
    return MaterialMapper.toResponseDto(material);
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete material by ID',
    description: 'Permanently deletes a material from the system. This action cannot be undone and will remove all associated files and data.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the material to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Material deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Material not found - The specified material ID does not exist' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to delete material' 
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteMaterialUseCase.execute(id);
  }
}

