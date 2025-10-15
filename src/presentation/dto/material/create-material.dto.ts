import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '../../../domain/interfaces/enums';

export class CreateMaterialDto {
  @ApiProperty({ 
    description: 'Material title',
    example: 'Introduction to Calculus',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ 
    description: 'Material description',
    example: 'A comprehensive introduction to calculus covering derivatives, integrals, and their applications'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Material type',
    example: 'pdf',
    enum: ['pdf', 'video', 'image', 'document', 'link', 'presentation']
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ 
    description: 'External URL (for link type materials only)',
    example: 'https://www.youtube.com/watch?v=example'
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ 
    description: 'File URL/path (for uploaded files - Cloudinary URL or local path)',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/materials/pdf/document.pdf'
  })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ 
    description: 'Original file name',
    example: 'calculus-introduction.pdf'
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ 
    description: 'File size in bytes',
    example: 2048576
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  fileSize?: number;

  @ApiPropertyOptional({ 
    description: 'MIME type of the file',
    example: 'application/pdf'
  })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({ 
    description: 'Material category',
    example: 'mathematics'
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Material tags',
    example: ['calculus', 'derivatives', 'integrals', 'mathematics'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ 
    description: 'Material difficulty level',
    example: 'medium',
    enum: Difficulty
  })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiPropertyOptional({ 
    description: 'Whether the material is active',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

