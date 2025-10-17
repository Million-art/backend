import { MaterialEntity } from '../../../domain/entities/material.entity';
import { MaterialResponseDto } from '../material/material-response.dto';

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
      difficulty: material.difficulty as any,
      isActive: material.isActive,
      viewCount: material.viewCount,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  }

  static toResponseDtoList(materials: MaterialEntity[]): MaterialResponseDto[] {
    return materials.map(material => this.toResponseDto(material));
  }
}
