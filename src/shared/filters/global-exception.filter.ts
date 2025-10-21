import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException, ErrorCode } from '../exceptions/business.exception';
import { ErrorResponseDto, ValidationErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponseDto;
    let statusCode: number;

    if (exception instanceof BusinessException) {
      // Handle our custom business exceptions
      statusCode = exception.getStatus();
      errorResponse = {
        statusCode,
        message: exception.message,
        errorCode: exception.errorCode,
        details: exception.details,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };
    } else if (exception instanceof HttpException) {
      // Handle NestJS built-in HTTP exceptions
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      let message: string;
      let errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;
      let details: any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        errorCode = responseObj.errorCode || this.mapHttpStatusToErrorCode(statusCode);
        details = responseObj.details;
      } else {
        message = exception.message;
      }

      errorResponse = {
        statusCode,
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };

      // Handle validation errors specifically
      if (statusCode === HttpStatus.BAD_REQUEST && Array.isArray(details)) {
        const validationResponse = errorResponse as ValidationErrorResponseDto;
        validationResponse.validationErrors = details.map((error: any) => 
          typeof error === 'string' ? error : error.message || error
        );
      }
    } else {
      // Handle unexpected errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : exception instanceof Error ? exception.message : 'Unknown error';

      errorResponse = {
        statusCode,
        message,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };

      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : undefined
      );
    }

    // Log the error
    this.logger.error(
      `HTTP ${statusCode} Error: ${errorResponse.message}`,
      {
        errorCode: errorResponse.errorCode,
        path: request.url,
        method: request.method,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
        body: request.body,
        query: request.query,
        params: request.params,
      }
    );

    response.status(statusCode).json(errorResponse);
  }

  private mapHttpStatusToErrorCode(statusCode: number): ErrorCode {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.RESOURCE_NOT_FOUND;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ErrorCode.INTERNAL_SERVER_ERROR;
      case HttpStatus.BAD_GATEWAY:
        return ErrorCode.EXTERNAL_SERVICE_ERROR;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
