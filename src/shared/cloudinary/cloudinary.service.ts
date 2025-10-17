import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryConfig: any,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'materials',
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      // Determine resource type based on file MIME type
      const getResourceType = (mimeType: string): 'raw' | 'image' | 'video' | 'auto' => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'video'; // Cloudinary uses 'video' for audio
        if (mimeType === 'application/pdf' || 
            mimeType.startsWith('application/') || 
            mimeType.startsWith('text/') ||
            mimeType.includes('document') ||
            mimeType.includes('spreadsheet') ||
            mimeType.includes('presentation')) {
          return 'raw';
        }
        return 'raw'; // Default to raw for unknown types
      };

      const resourceType = getResourceType(file.mimetype);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `maraki/${folder}`,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              original_filename: result.original_filename,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
            });
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async getFileInfo(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to get file info: No result returned'));
        }
      });
    });
  }

  generateOptimizedUrl(publicId: string, options: any = {}): string {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    });
  }
}
