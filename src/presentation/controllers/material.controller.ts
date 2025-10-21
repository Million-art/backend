import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MaterialResponseDto, MaterialListResponseDto } from '../dto/material/material-response.dto';
import { MaterialMapper } from '../dto/material/material.mapper';
import { GetAllMaterialsUseCase } from '../../application/use-cases/material/get-all-materials.usecase';
import { GetMaterialByIdUseCase } from '../../application/use-cases/material/get-material-by-id.usecase';
import { ViewMaterialUseCase } from '../../application/use-cases/material/view-material.usecase';
import { GetCategoriesUseCase } from '../../application/use-cases/material/get-categories.usecase';
import { GetTypesUseCase } from '../../application/use-cases/material/get-types.usecase';
import { GetDifficultiesUseCase } from '../../application/use-cases/material/get-difficulties.usecase';
import { BusinessException } from '../../shared/exceptions/business.exception';

@ApiTags('materials')
@Controller('api/materials')
export class MaterialController {
  constructor(
    private readonly getAllMaterialsUseCase: GetAllMaterialsUseCase,
    private readonly getMaterialByIdUseCase: GetMaterialByIdUseCase,
    private readonly viewMaterialUseCase: ViewMaterialUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getTypesUseCase: GetTypesUseCase,
    private readonly getDifficultiesUseCase: GetDifficultiesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  @ApiResponse({ status: 200, description: 'List of materials', type: MaterialListResponseDto })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by material type' })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Filter by difficulty' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title and description' })
  async getMaterials(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ): Promise<MaterialListResponseDto> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const isActiveBool = isActive ? isActive === 'true' : undefined;
    
    const result = await this.getAllMaterialsUseCase.execute({
      category,
      type,
      difficulty,
      isActive: isActiveBool,
      search,
      page: pageNum,
      limit: limitNum,
    });

    return MaterialMapper.toListResponseDto(
      result.materials,
      result.total,
      result.page,
      result.limit
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiResponse({ status: 200, description: 'Material found', type: MaterialResponseDto })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async getMaterialById(@Param('id') id: string): Promise<MaterialResponseDto> {
    const material = await this.getMaterialByIdUseCase.execute(id);
    
    if (!material) {
      throw BusinessException.notFound('Material', id);
    }

    return MaterialMapper.toResponseDto(material);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Increment material view count' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  async viewMaterial(@Param('id') id: string) {
    const material = await this.viewMaterialUseCase.execute(id);
    
    if (!material) {
      throw BusinessException.notFound('Material', id);
    }

    return {
      id,
      viewed: true,
      viewCount: material.viewCount,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all material categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories() {
    const categories = await this.getCategoriesUseCase.execute();
    
    return {
      categories,
    };
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all material types' })
  @ApiResponse({ status: 200, description: 'List of material types' })
  async getTypes() {
    const types = await this.getTypesUseCase.execute();
    
    return {
      types,
    };
  }

  @Get('difficulties')
  @ApiOperation({ summary: 'Get all difficulty levels' })
  @ApiResponse({ status: 200, description: 'List of difficulty levels' })
  async getDifficulties() {
    const difficulties = await this.getDifficultiesUseCase.execute();
    
    return {
      difficulties,
    };
  }

}
