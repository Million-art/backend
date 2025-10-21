import { Injectable, Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { MaterialEntity } from '../../../domain/entities/material.entity';
import { BusinessException, ErrorCode } from '../../../shared/exceptions/business.exception';

@Injectable()
export class GetMaterialByIdUseCase {
  constructor(
    @Inject('MaterialRepository')
    private readonly materialRepository: MaterialRepository
  ) {}

  async execute(id: string): Promise<MaterialEntity | null> {
    if (!id || id.trim().length === 0) {
      throw BusinessException.validation('Material ID is required', {
        field: 'id',
        code: ErrorCode.MISSING_REQUIRED_FIELD,
      });
    }

    return await this.materialRepository.findById(id);
  }
}
