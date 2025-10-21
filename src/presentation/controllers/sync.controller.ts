import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MaterialEntity } from '../../domain/entities/material.entity';
import { Inject } from '@nestjs/common';
import type { MaterialRepository } from '../../domain/ports/material.repository';

@ApiTags('sync')
@Controller('api/sync')
export class SyncController {
  private readonly logger = new Logger(SyncController.name);

  constructor(
    @Inject('MaterialRepository')
    private readonly materialRepository: MaterialRepository,
  ) {}

  @Post('material')
  @ApiOperation({ summary: 'Sync material from dashboard-backend' })
  @ApiResponse({ status: 201, description: 'Material synced successfully' })
  async syncMaterial(@Body() materialData: {
    id: string;
    title: string;
    type: string;
    difficulty: string;
    description?: string;
    url?: string;
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    category?: string;
    tags?: string[];
    isActive: boolean;
    viewCount: number;
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE' | 'DEACTIVATE';
    source: string;
    createdAt: string;
    updatedAt: string;
  }) {
    try {
      // Check if material already exists
      const existingMaterial = await this.materialRepository.findById(materialData.id);
      
      if (existingMaterial) {
        // Update existing material
        if (materialData.operation === 'UPDATE' || materialData.operation === 'ACTIVATE' || materialData.operation === 'DEACTIVATE') {
          const material = new MaterialEntity(
            materialData.id,
            materialData.title,
            materialData.type,
            materialData.difficulty,
            materialData.description,
            materialData.url,
            materialData.filePath,
            materialData.fileName,
            materialData.fileSize,
            materialData.mimeType,
            materialData.category,
            materialData.tags,
            materialData.isActive,
            materialData.viewCount,
            new Date(materialData.createdAt),
            new Date(materialData.updatedAt)
          );
          
          const updatedMaterial = await this.materialRepository.update(materialData.id, material);
          
          if (updatedMaterial) {
            return {
              success: true,
              message: `Material ${materialData.operation} processed successfully`,
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          } else {
            return {
              success: false,
              message: 'Failed to update material',
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          }
        } else if (materialData.operation === 'DELETE') {
          const deleted = await this.materialRepository.delete(materialData.id);
          
          if (deleted) {
            return {
              success: true,
              message: `Material ${materialData.operation} processed successfully`,
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          } else {
            return {
              success: false,
              message: 'Failed to delete material',
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          }
        }
        
        return {
          success: true,
          message: 'Material already exists',
          materialId: materialData.id,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Create new material
        if (materialData.operation === 'CREATE') {
          const material = new MaterialEntity(
            materialData.id,
            materialData.title,
            materialData.type,
            materialData.difficulty,
            materialData.description,
            materialData.url,
            materialData.filePath,
            materialData.fileName,
            materialData.fileSize,
            materialData.mimeType,
            materialData.category,
            materialData.tags,
            materialData.isActive,
            materialData.viewCount,
            new Date(materialData.createdAt),
            new Date(materialData.updatedAt)
          );
          
          const savedMaterial = await this.materialRepository.save(material);
          
          if (savedMaterial) {
            return {
              success: true,
              message: `Material ${materialData.operation} processed successfully`,
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          } else {
            return {
              success: false,
              message: 'Failed to create material',
              materialId: materialData.id,
              timestamp: new Date().toISOString(),
            };
          }
        } else {
          return {
            success: false,
            message: `Material not found for operation ${materialData.operation}`,
            materialId: materialData.id,
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      this.logger.error(`Failed to sync material: ${materialData.id}`, error);
      
      return {
        success: false,
        message: 'Failed to sync material',
        error: error.message,
        materialId: materialData.id,
        timestamp: new Date().toISOString(),
      };
    }
  }
}