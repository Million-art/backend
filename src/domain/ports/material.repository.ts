import { MaterialEntity } from '../entities/material.entity';

export interface MaterialRepository {
  findAll(filters?: {
    category?: string;
    type?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ materials: MaterialEntity[]; total: number }>;
  
  findById(id: string): Promise<MaterialEntity | null>;
  
  findByCategory(category: string): Promise<MaterialEntity[]>;
  
  findByType(type: string): Promise<MaterialEntity[]>;
  
  findByDifficulty(difficulty: string): Promise<MaterialEntity[]>;
  
  findActiveMaterials(): Promise<MaterialEntity[]>;
  
  searchMaterials(searchTerm: string): Promise<MaterialEntity[]>;
  
  getCategories(): Promise<string[]>;
  
  getTypes(): Promise<string[]>;
  
  getDifficulties(): Promise<string[]>;
  
  save(material: MaterialEntity): Promise<MaterialEntity>;
  
  update(id: string, material: Partial<MaterialEntity>): Promise<MaterialEntity | null>;
  
  incrementViewCount(id: string): Promise<MaterialEntity | null>;
  
  delete(id: string): Promise<boolean>;
}
