import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material, MaterialDocument } from '../schemas/material.schema';
import { MaterialRepository as IMaterialRepository } from '../../domain/ports/material.repository';
import { MaterialEntity } from '../../domain/entities/material.entity';

@Injectable()
export class MaterialRepository implements IMaterialRepository {
  private readonly logger = new Logger(MaterialRepository.name);

  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async findAll(filters?: {
    category?: string;
    type?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ materials: MaterialEntity[]; total: number }> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [materials, total] = await Promise.all([
      this.materialModel.find(query).skip(skip).limit(limit).exec(),
      this.materialModel.countDocuments(query).exec(),
    ]);

    return {
      materials: materials.map(material => this.convertToEntity(material)),
      total,
    };
  }

  async findById(id: string): Promise<MaterialEntity | null> {
    const material = await this.materialModel.findOne({ id }).exec();
    return material ? this.convertToEntity(material) : null;
  }

  async findByCategory(category: string): Promise<MaterialEntity[]> {
    const materials = await this.materialModel.find({ category, isActive: true }).exec();
    return materials.map(material => this.convertToEntity(material));
  }

  async findByType(type: string): Promise<MaterialEntity[]> {
    const materials = await this.materialModel.find({ type, isActive: true }).exec();
    return materials.map(material => this.convertToEntity(material));
  }

  async findByDifficulty(difficulty: string): Promise<MaterialEntity[]> {
    const materials = await this.materialModel.find({ difficulty, isActive: true }).exec();
    return materials.map(material => this.convertToEntity(material));
  }

  async findActiveMaterials(): Promise<MaterialEntity[]> {
    const materials = await this.materialModel.find({ isActive: true }).exec();
    return materials.map(material => this.convertToEntity(material));
  }

  async searchMaterials(searchTerm: string): Promise<MaterialEntity[]> {
    const materials = await this.materialModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } },
      ],
      isActive: true,
    }).exec();

    return materials.map(material => this.convertToEntity(material));
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.materialModel.distinct('category', { isActive: true }).exec();
    return categories.filter(cat => cat && cat.trim().length > 0);
  }

  async getTypes(): Promise<string[]> {
    const types = await this.materialModel.distinct('type', { isActive: true }).exec();
    return types.filter(type => type && type.trim().length > 0);
  }

  async getDifficulties(): Promise<string[]> {
    const difficulties = await this.materialModel.distinct('difficulty', { isActive: true }).exec();
    return difficulties.filter(diff => diff && diff.trim().length > 0);
  }

  async save(material: MaterialEntity): Promise<MaterialEntity> {
    const materialDoc = this.convertToDocument(material);
    const savedMaterial = await this.materialModel.create(materialDoc);
    this.logger.log(`Material saved to MongoDB: ${material.id}`);
    return this.convertToEntity(savedMaterial);
  }

  async update(id: string, material: Partial<MaterialEntity>): Promise<MaterialEntity | null> {
    const updatedMaterial = await this.materialModel.findOneAndUpdate(
      { id },
      { $set: this.convertToDocument(material) },
      { new: true }
    ).exec();
    
    return updatedMaterial ? this.convertToEntity(updatedMaterial) : null;
  }

  async incrementViewCount(id: string): Promise<MaterialEntity | null> {
    const material = await this.materialModel.findOneAndUpdate(
      { id },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).exec();
    
    return material ? this.convertToEntity(material) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.materialModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  private convertToEntity(materialDoc: any): MaterialEntity {
    // Use MongoDB _id as fallback if id field is missing
    const entityId = materialDoc.id || materialDoc._id?.toString();
    
    if (!entityId) {
      throw new Error(`Material document missing both id and _id fields: ${JSON.stringify(materialDoc)}`);
    }

    return new MaterialEntity(
      entityId,
      materialDoc.title,
      materialDoc.type,
      materialDoc.difficulty,
      materialDoc.description,
      materialDoc.url,
      materialDoc.filePath,
      materialDoc.fileName,
      materialDoc.fileSize,
      materialDoc.mimeType,
      materialDoc.category,
      materialDoc.tags,
      materialDoc.isActive,
      materialDoc.viewCount,
      materialDoc.createdAt,
      materialDoc.updatedAt,
    );
  }

  private convertToDocument(material: MaterialEntity | Partial<MaterialEntity>): any {
    return {
      id: material.id,
      title: material.title,
      description: material.description,
      type: material.type,
      url: material.url,
      filePath: material.filePath,
      fileName: material.fileName,
      fileSize: material.fileSize,
      mimeType: material.mimeType,
      category: material.category,
      tags: material.tags,
      difficulty: material.difficulty,
      isActive: material.isActive,
      viewCount: material.viewCount,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  }
}
