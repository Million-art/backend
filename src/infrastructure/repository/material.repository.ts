import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MaterialEntity } from '../../domain/entities/material.entity';
import { MaterialModel } from '../models/material.model';
import { MaterialRepository as IMaterialRepository } from '../../domain/ports/material.repository';
import type { MaterialFilterOptions, MaterialFilterResult } from '../../domain/ports/material.repository';

@Injectable()
export class MaterialRepositoryImpl implements IMaterialRepository {
  constructor(
    @InjectRepository(MaterialModel)
    private readonly materialRepository: Repository<MaterialModel>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async save(material: MaterialEntity): Promise<MaterialEntity> {
    const materialModel = this.toModel(material);
    const savedModel = await this.materialRepository.save(materialModel);
    return this.toEntity(savedModel);
  }

  async findById(id: string): Promise<MaterialEntity | null> {
    const cacheKey = `material:${id}`;
    
    // Try to get from cache first
    const cached = await this.cacheManager.get<MaterialEntity>(cacheKey);
    if (cached) {
      return cached;
    }

    const materialModel = await this.materialRepository.findOne({
      where: { id, isActive: true },
    });
    
    if (!materialModel) {
      return null;
    }

    const material = this.toEntity(materialModel);
    
    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, material, 300);
    
    return material;
  }

  async findAll(): Promise<MaterialEntity[]> {
    const materialModels = await this.materialRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return materialModels.map(model => this.toEntity(model));
  }

  async findByCategory(category: string): Promise<MaterialEntity[]> {
    const materialModels = await this.materialRepository.find({
      where: { category, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return materialModels.map(model => this.toEntity(model));
  }

  async findByType(type: string): Promise<MaterialEntity[]> {
    const materialModels = await this.materialRepository.find({
      where: { type, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return materialModels.map(model => this.toEntity(model));
  }

  async findByDifficulty(difficulty: string): Promise<MaterialEntity[]> {
    const materialModels = await this.materialRepository.find({
      where: { difficulty, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return materialModels.map(model => this.toEntity(model));
  }

  async searchByTitle(title: string): Promise<MaterialEntity[]> {
    const materialModels = await this.materialRepository
      .createQueryBuilder('material')
      .where('material.title ILIKE :title', { title: `%${title}%` })
      .andWhere('material.isActive = :isActive', { isActive: true })
      .orderBy('material.createdAt', 'DESC')
      .getMany();
    return materialModels.map(model => this.toEntity(model));
  }

  async findWithFilters(options: MaterialFilterOptions): Promise<MaterialFilterResult> {
    const {
      category,
      type,
      difficulty,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    // Build query
    const queryBuilder = this.materialRepository
      .createQueryBuilder('material')
      .where('material.isActive = :isActive', { isActive: true });

    // Apply filters
    if (category) {
      queryBuilder.andWhere('material.category = :category', { category });
    }

    if (type) {
      queryBuilder.andWhere('material.type = :type', { type });
    }

    if (difficulty) {
      queryBuilder.andWhere('material.difficulty = :difficulty', { difficulty });
    }

    if (search) {
      queryBuilder.andWhere(
        '(material.title ILIKE :search OR material.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply sorting and pagination
    queryBuilder
      .orderBy(`material.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const materialModels = await queryBuilder.getMany();
    const materials = materialModels.map(model => this.toEntity(model));

    return {
      materials,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.materialRepository.update(id, { isActive: false });
  }

  async update(material: MaterialEntity): Promise<MaterialEntity> {
    const materialModel = this.toModel(material);
    const updatedModel = await this.materialRepository.save(materialModel);
    return this.toEntity(updatedModel);
  }

  private toEntity(model: MaterialModel): MaterialEntity {
    return new MaterialEntity(
      model.id,
      model.title,
      model.type,
      model.difficulty,
      model.description || undefined,
      model.url || undefined,
      model.filePath || undefined,
      model.fileName || undefined,
      model.fileSize || undefined,
      model.mimeType || undefined,
      model.category || undefined,
      model.tags || undefined,
      model.isActive,
      model.downloadCount,
      model.viewCount,
      model.createdAt,
      model.updatedAt,
    );
  }

  private toModel(entity: MaterialEntity): MaterialModel {
    const model = new MaterialModel();
    model.id = entity.id;
    model.title = entity.title;
    model.description = entity.description || null;
    model.type = entity.type;
    model.url = entity.url || null;
    model.filePath = entity.filePath || null;
    model.fileName = entity.fileName || null;
    model.fileSize = entity.fileSize || null;
    model.mimeType = entity.mimeType || null;
    model.category = entity.category || null;
    model.tags = entity.tags || null;
    model.difficulty = entity.difficulty;
    model.isActive = entity.isActive;
    model.downloadCount = entity.downloadCount;
    model.viewCount = entity.viewCount;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
