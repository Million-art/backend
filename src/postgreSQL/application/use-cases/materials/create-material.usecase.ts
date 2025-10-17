import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { MaterialEntity } from '../../../domain/entities/material.entity';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { CreateMaterialDto } from '../../../presentation/dto/material/create-material.dto';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class CreateMaterialUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: CreateMaterialDto): Promise<MaterialEntity> {
    // Create a new domain entity
    const newMaterial = MaterialEntity.create(
      request.title,
      request.type,
      request.difficulty,
      request.description,
      request.url,
      request.filePath,
      request.fileName,
      request.fileSize,
      request.mimeType,
      request.category,
      request.tags,
    );

    // Set isActive if provided
    if (request.isActive !== undefined) {
      newMaterial.isActive = request.isActive;
    }

    // Save material to database
    const savedMaterial = await this.materialRepository.save(newMaterial);
    this.loggerService.log(`✅ Material created successfully: ${savedMaterial.id}`, 'CreateMaterialUseCase');

    return savedMaterial;
  }
}
