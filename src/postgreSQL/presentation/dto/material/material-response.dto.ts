import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '../../../domain/interfaces/enums';

export class MaterialResponseDto {
  @ApiProperty({ 
    description: 'Material ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({ 
    description: 'Material title',
    example: 'Introduction to Calculus'
  })
  title: string;

  @ApiPropertyOptional({ 
    description: 'Material description',
    example: 'A comprehensive introduction to calculus covering derivatives, integrals, and their applications'
  })
  description?: string;

  @ApiProperty({ 
    description: 'Material type',
    example: 'pdf'
  })
  type: string;

  @ApiPropertyOptional({ 
    description: 'Material URL',
    example: 'https://www.youtube.com/watch?v=example'
  })
  url?: string;

  @ApiPropertyOptional({ 
    description: 'File path',
    example: '/uploads/materials/calculus-intro.pdf'
  })
  filePath?: string;

  @ApiPropertyOptional({ 
    description: 'Original file name',
    example: 'calculus-introduction.pdf'
  })
  fileName?: string;

  @ApiPropertyOptional({ 
    description: 'File size in bytes',
    example: 2048576
  })
  fileSize?: number;

  @ApiPropertyOptional({ 
    description: 'MIME type',
    example: 'application/pdf'
  })
  mimeType?: string;

  @ApiPropertyOptional({ 
    description: 'Material category',
    example: 'mathematics'
  })
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Material tags',
    example: ['calculus', 'derivatives', 'integrals', 'mathematics'],
    type: [String]
  })
  tags?: string[];

  @ApiProperty({ 
    description: 'Difficulty level',
    example: 'medium',
    enum: Difficulty
  })
  difficulty: Difficulty;

  @ApiProperty({ 
    description: 'Whether the material is active',
    example: true
  })
  isActive: boolean;


  @ApiProperty({ 
    description: 'View count',
    example: 156
  })
  viewCount: number;

  @ApiProperty({ 
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last update timestamp',
    example: '2024-01-15T14:22:00.000Z'
  })
  updatedAt: Date;
}

