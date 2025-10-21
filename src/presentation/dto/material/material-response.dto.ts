import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MaterialResponseDto {
  @ApiProperty({ description: 'Material ID' })
  id: string;

  @ApiProperty({ description: 'Material title' })
  title: string;

  @ApiPropertyOptional({ description: 'Material description' })
  description?: string;

  @ApiProperty({ description: 'Material type' })
  type: string;

  @ApiPropertyOptional({ description: 'Material URL' })
  url?: string;

  @ApiPropertyOptional({ description: 'File path' })
  filePath?: string;

  @ApiPropertyOptional({ description: 'Original file name' })
  fileName?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  fileSize?: number;

  @ApiPropertyOptional({ description: 'MIME type' })
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Material category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Material tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Difficulty level' })
  difficulty: string;

  @ApiProperty({ description: 'Whether material is active' })
  isActive: boolean;

  @ApiProperty({ description: 'View count' })
  viewCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Formatted file size' })
  fileSizeFormatted: string;

  @ApiProperty({ description: 'Whether this is a file' })
  isFile: boolean;

  @ApiProperty({ description: 'Whether this is a URL' })
  isUrl: boolean;

  @ApiProperty({ description: 'Whether this is a video' })
  isVideo: boolean;

  @ApiProperty({ description: 'Whether this is a document' })
  isDocument: boolean;

  @ApiProperty({ description: 'Whether this is an image' })
  isImage: boolean;
}

export class MaterialListResponseDto {
  @ApiProperty({ description: 'List of materials', type: [MaterialResponseDto] })
  data: MaterialResponseDto[];

  @ApiProperty({ description: 'Total number of materials' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
