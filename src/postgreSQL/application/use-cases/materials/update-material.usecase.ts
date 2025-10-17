import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MaterialEntity } from '../../../domain/entities/material.entity';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { UpdateMaterialDto } from '../../../presentation/dto/material/update-material.dto';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class UpdateMaterialUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string, request: UpdateMaterialDto): Promise<MaterialEntity> {
    // Check if material exists
    const existingMaterial = await this.materialRepository.findById(id);
    if (!existingMaterial) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }

    // Update the material entity
    const updatedMaterial = existingMaterial.updateMaterial(
      request.title,
      request.description,
      request.type,
      request.url,
      request.filePath,
      request.fileName,
      request.fileSize,
      request.mimeType,
      request.category,
      request.tags,
      request.difficulty,
    );

    // Update isActive if provided
    if (request.isActive !== undefined) {
      updatedMaterial.isActive = request.isActive;
    }

    // Save updated material to database
    const savedMaterial = await this.materialRepository.update(updatedMaterial);
    this.loggerService.log(`✅ Material updated successfully: ${savedMaterial.id}`, 'UpdateMaterialUseCase');

    return savedMaterial;
  }
}
