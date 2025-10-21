import { MaterialDomainInterface } from '../interfaces/material.domain.interface';

export class MaterialEntity implements MaterialDomainInterface {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly type: string;
  public readonly url?: string;
  public readonly filePath?: string;
  public readonly fileName?: string;
  public readonly fileSize?: number;
  public readonly mimeType?: string;
  public readonly category?: string;
  public readonly tags?: string[];
  public readonly difficulty: string;
  public readonly isActive: boolean;
  public readonly viewCount: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

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
    this.viewCount = viewCount;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Material ID is required');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Material title is required');
    }
    if (!this.type || this.type.trim().length === 0) {
      throw new Error('Material type is required');
    }
    if (!this.difficulty || this.difficulty.trim().length === 0) {
      throw new Error('Material difficulty is required');
    }
  }

  public static create(
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
    const id = crypto.randomUUID();
    return new MaterialEntity(
      id,
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
      true, // isActive
      0, // viewCount
    );
  }

  public incrementViewCount(): MaterialEntity {
    return new MaterialEntity(
      this.id,
      this.title,
      this.type,
      this.difficulty,
      this.description,
      this.url,
      this.filePath,
      this.fileName,
      this.fileSize,
      this.mimeType,
      this.category,
      this.tags,
      this.isActive,
      this.viewCount + 1,
      this.createdAt,
      new Date(), // updatedAt
    );
  }

  public update(
    updates: Partial<{
      title: string;
      description: string;
      type: string;
      url: string;
      filePath: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      category: string;
      tags: string[];
      difficulty: string;
      isActive: boolean;
    }>
  ): MaterialEntity {
    return new MaterialEntity(
      this.id,
      updates.title ?? this.title,
      updates.type ?? this.type,
      updates.difficulty ?? this.difficulty,
      updates.description !== undefined ? updates.description : this.description,
      updates.url !== undefined ? updates.url : this.url,
      updates.filePath !== undefined ? updates.filePath : this.filePath,
      updates.fileName !== undefined ? updates.fileName : this.fileName,
      updates.fileSize !== undefined ? updates.fileSize : this.fileSize,
      updates.mimeType !== undefined ? updates.mimeType : this.mimeType,
      updates.category !== undefined ? updates.category : this.category,
      updates.tags !== undefined ? updates.tags : this.tags,
      updates.isActive !== undefined ? updates.isActive : this.isActive,
      this.viewCount,
      this.createdAt,
      new Date(), // updatedAt
    );
  }

  public activate(): MaterialEntity {
    if (this.isActive) {
      throw new Error('Material is already active');
    }
    return this.update({ isActive: true });
  }

  public deactivate(): MaterialEntity {
    if (!this.isActive) {
      throw new Error('Material is already inactive');
    }
    return this.update({ isActive: false });
  }

  public get fileSizeFormatted(): string {
    if (!this.fileSize) return 'Unknown';
    
    const bytes = this.fileSize;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  public get isFile(): boolean {
    return !!(this.filePath || this.fileName);
  }

  public get isUrl(): boolean {
    return !!this.url;
  }

  public get isVideo(): boolean {
    return this.type === 'video' || (this.mimeType?.startsWith('video/') ?? false);
  }

  public get isDocument(): boolean {
    return this.type === 'document' || (this.mimeType?.startsWith('application/') ?? false);
  }

  public get isImage(): boolean {
    return this.type === 'image' || (this.mimeType?.startsWith('image/') ?? false);
  }
}
