import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class DeleteMaterialUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(id: string): Promise<void> {
    // Check if material exists
    const existingMaterial = await this.materialRepository.findById(id);
    if (!existingMaterial) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }

    // Soft delete material
    await this.materialRepository.softDelete(id);
    this.loggerService.log(`✅ Material deleted successfully: ${id}`, 'DeleteMaterialUseCase');
  }
}
