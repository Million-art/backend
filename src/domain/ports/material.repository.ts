import { MaterialEntity } from '../entities/material.entity';
import { Difficulty } from '../interfaces/enums';
import type { MaterialFilterOptions, MaterialFilterResult } from '../interfaces/enums/material.enum';

// Re-export the types for use in other modules
export type { MaterialFilterOptions, MaterialFilterResult };
export interface MaterialRepository {
  save(material: MaterialEntity): Promise<MaterialEntity>;
  findById(id: string): Promise<MaterialEntity | null>;
  findAll(): Promise<MaterialEntity[]>;
  findByCategory(category: string): Promise<MaterialEntity[]>;
  findByType(type: string): Promise<MaterialEntity[]>;
  findByDifficulty(difficulty: string): Promise<MaterialEntity[]>;
  searchByTitle(title: string): Promise<MaterialEntity[]>;
  findWithFilters(options: MaterialFilterOptions): Promise<MaterialFilterResult>;
  softDelete(id: string): Promise<void>;
  update(material: MaterialEntity): Promise<MaterialEntity>;
}

