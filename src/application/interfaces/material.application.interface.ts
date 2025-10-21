import { MaterialEntity } from '../../domain/entities/material.entity';

export interface MaterialApplicationInterface {
  getAllMaterials(filters?: {
    category?: string;
    type?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ materials: MaterialEntity[]; total: number; page: number; limit: number; totalPages: number }>;
  
  getMaterialById(id: string): Promise<MaterialEntity | null>;
  
  viewMaterial(id: string): Promise<MaterialEntity | null>;
  
  getCategories(): Promise<string[]>;
  
  getTypes(): Promise<string[]>;
  
  getDifficulties(): Promise<string[]>;
}
