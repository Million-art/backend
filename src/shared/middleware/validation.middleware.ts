import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Basic request validation
    this.validateRequestSize(req);
    this.validateContentType(req);
    this.sanitizeInput(req);
    next();
  }

  private validateRequestSize(req: Request) {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (contentLength > maxSize) {
      throw new BadRequestException('Request payload too large');
    }
  }

  private validateContentType(req: Request) {
    const contentType = req.headers['content-type'];
    const allowedTypes = ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data'];

    if (req.method !== 'GET' && req.method !== 'DELETE' && contentType && !allowedTypes.some(type => contentType.includes(type))) {
      throw new BadRequestException('Invalid content type');
    }
  }

  private sanitizeInput(req: Request) {
    // Basic XSS protection
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            sanitized[key] = sanitize(obj[key]);
          }
        }
        return sanitized;
      }
      return obj;
    };

    if (req.body) {
      req.body = sanitize(req.body);
    }
    if (req.query) {
      req.query = sanitize(req.query);
    }
    if (req.params) {
      req.params = sanitize(req.params);
    }
  }
}
