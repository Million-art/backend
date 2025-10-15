export interface MaterialInterface {
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
}

