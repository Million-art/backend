import { Injectable, Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import { MaterialEntity } from '../../../domain/entities/material.entity';

@Injectable()
export class GetAllMaterialsUseCase {
  constructor(
    @Inject('MaterialRepository')
    private readonly materialRepository: MaterialRepository
  ) {}

  async execute(filters?: {
    category?: string;
    type?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ materials: MaterialEntity[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    
    const result = await this.materialRepository.findAll({
      ...filters,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      materials: result.materials,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
