import { MaterialEntity } from '../../../domain/entities/material.entity';
import { MaterialResponseDto, MaterialListResponseDto } from './material-response.dto';

export class MaterialMapper {
  static toResponseDto(material: MaterialEntity): MaterialResponseDto {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      type: material.type,
      url: material.url,
      filePath: material.filePath,
      fileName: material.fileName,
      fileSize: material.fileSize,
      mimeType: material.mimeType,
      category: material.category,
      tags: material.tags,
      difficulty: material.difficulty,
      isActive: material.isActive,
      viewCount: material.viewCount,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      fileSizeFormatted: material.fileSizeFormatted,
      isFile: material.isFile,
      isUrl: material.isUrl,
      isVideo: material.isVideo,
      isDocument: material.isDocument,
      isImage: material.isImage,
    };
  }

  static toResponseDtoList(materials: MaterialEntity[]): MaterialResponseDto[] {
    return materials.map(material => this.toResponseDto(material));
  }

  static toListResponseDto(
    materials: MaterialEntity[],
    total: number,
    page: number,
    limit: number
  ): MaterialListResponseDto {
    return {
      data: this.toResponseDtoList(materials),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
