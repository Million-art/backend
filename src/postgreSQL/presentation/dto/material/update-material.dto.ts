import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '../../../domain/interfaces/enums';

export class UpdateMaterialDto {
  @ApiPropertyOptional({ 
    description: 'Material title',
    example: 'Advanced Calculus',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ 
    description: 'Material description',
    example: 'Advanced calculus concepts including multivariable calculus and differential equations'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Material type',
    example: 'pdf',
    enum: ['pdf', 'video', 'image', 'document', 'link', 'presentation']
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ 
    description: 'Material URL (for links and videos)',
    example: 'https://www.youtube.com/watch?v=advanced-example'
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ 
    description: 'File path (for uploaded files)',
    example: '/uploads/materials/advanced-calculus.pdf'
  })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ 
    description: 'Original file name',
    example: 'advanced-calculus.pdf'
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ 
    description: 'File size in bytes',
    example: 4097152
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
    example: ['calculus', 'multivariable', 'differential-equations', 'advanced'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Material difficulty level',
    example: 'hard',
    enum: Difficulty
  })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @ApiPropertyOptional({ 
    description: 'Whether the material is active',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

