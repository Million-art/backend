import { MaterialInterface } from '../interfaces/material.interface';
import { v4 as uuidv4 } from 'uuid';

export class MaterialEntity implements MaterialInterface {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  category?: string;
  tags?: string[];
  difficulty: string;
  isActive: boolean;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    type: string,
    difficulty: string,
    description?: string,
    url?: string,
    filePath?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
    category?: string,
    tags?: string[],
    isActive: boolean = true,
    downloadCount: number = 0,
    viewCount: number = 0,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.url = url;
    this.filePath = filePath;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.category = category;
    this.tags = tags;
    this.difficulty = difficulty;
    this.isActive = isActive;
    this.downloadCount = downloadCount;
    this.viewCount = viewCount;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(
    title: string,
    type: string,
    difficulty: string,
    description?: string,
    url?: string,
    filePath?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
    category?: string,
    tags?: string[],
  ): MaterialEntity {
    return new MaterialEntity(
      uuidv4(),
      title,
      type,
      difficulty,
      description,
      url,
      filePath,
      fileName,
      fileSize,
      mimeType,
      category,
      tags,
    );
  }

  updateMaterial(
    title?: string,
    description?: string,
    type?: string,
    url?: string,
    filePath?: string,
    fileName?: string,
    fileSize?: number,
    mimeType?: string,
    category?: string,
    tags?: string[],
    difficulty?: string,
  ): MaterialEntity {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (type !== undefined) this.type = type;
    if (url !== undefined) this.url = url;
    if (filePath !== undefined) this.filePath = filePath;
    if (fileName !== undefined) this.fileName = fileName;
    if (fileSize !== undefined) this.fileSize = fileSize;
    if (mimeType !== undefined) this.mimeType = mimeType;
    if (category !== undefined) this.category = category;
    if (tags !== undefined) this.tags = tags;
    if (difficulty !== undefined) this.difficulty = difficulty;
    
    this.updatedAt = new Date();
    return this;
  }

  activate(): MaterialEntity {
    this.isActive = true;
    this.updatedAt = new Date();
    return this;
  }

  deactivate(): MaterialEntity {
    this.isActive = false;
    this.updatedAt = new Date();
    return this;
  }

  incrementDownloadCount(): MaterialEntity {
    this.downloadCount += 1;
    this.updatedAt = new Date();
    return this;
  }

  incrementViewCount(): MaterialEntity {
    this.viewCount += 1;
    this.updatedAt = new Date();
    return this;
  }
}

