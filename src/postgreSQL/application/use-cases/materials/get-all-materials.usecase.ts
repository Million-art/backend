import { Injectable, Inject } from '@nestjs/common';
import { MaterialEntity } from '../../../domain/entities/material.entity';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { LoggerService } from '../../../../shared/logs/logger.service';

@Injectable()
export class GetAllMaterialsUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(): Promise<MaterialEntity[]> {
    const materials = await this.materialRepository.findAll();
    this.loggerService.log(`✅ Retrieved ${materials.length} materials`, 'GetAllMaterialsUseCase');
    return materials;
  }
}
