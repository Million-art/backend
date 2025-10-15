import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MaterialEntity } from '../../../domain/entities/material.entity';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class GetMaterialUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }

    // Increment view count
    const updatedMaterial = material.incrementViewCount();
    await this.materialRepository.update(updatedMaterial);
    
    this.loggerService.log(`✅ Material retrieved: ${id}`, 'GetMaterialUseCase');
    return updatedMaterial;
  }
}
