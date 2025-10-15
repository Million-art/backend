import { Injectable, Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../../domain/ports/material.repository';
import type { MaterialFilterOptions, MaterialFilterResult } from '../../../domain/interfaces/enums/material.enum';
import { LoggerService } from '../../../shared/logs/logger.service';

@Injectable()
export class GetMaterialsWithFiltersUseCase {
  constructor(
    @Inject('MaterialRepository') private readonly materialRepository: MaterialRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(options: MaterialFilterOptions): Promise<MaterialFilterResult> {
    // Validate pagination parameters
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10)); // Max 100 items per page

    // Validate sort parameters
    const validSortFields = ['createdAt', 'title', 'downloadCount', 'viewCount'];
    const sortBy = validSortFields.includes(options.sortBy || '') ? options.sortBy : 'createdAt';
    const sortOrder = ['ASC', 'DESC'].includes(options.sortOrder || '') ? options.sortOrder : 'DESC';

    const filterOptions: MaterialFilterOptions = {
      ...options,
      page,
      limit,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    };

    const result = await this.materialRepository.findWithFilters(filterOptions);
    
    this.loggerService.log(
      `✅ Materials retrieved with filters: ${result.materials.length} items, page ${result.page}/${result.totalPages}`,
      'GetMaterialsWithFiltersUseCase'
    );
    
    return result;
  }
}
