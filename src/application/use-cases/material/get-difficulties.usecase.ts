import { Injectable, Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../../domain/ports/material.repository';

@Injectable()
export class GetDifficultiesUseCase {
  constructor(
    @Inject('MaterialRepository')
    private readonly materialRepository: MaterialRepository
  ) {}

  async execute(): Promise<string[]> {
    return await this.materialRepository.getDifficulties();
  }
}
