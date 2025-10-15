import { MaterialEntity } from "../../entities/material.entity";

export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
  }
export interface MaterialFilterOptions {
    category?: string;
    type?: string;
    difficulty?: Difficulty;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'title' | 'downloadCount' | 'viewCount';
    sortOrder?: 'ASC' | 'DESC';
  }
  
  export interface MaterialFilterResult {
    materials: MaterialEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }