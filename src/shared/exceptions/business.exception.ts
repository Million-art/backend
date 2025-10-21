import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Not found errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  QUIZ_NOT_FOUND = 'QUIZ_NOT_FOUND',
  MATERIAL_NOT_FOUND = 'MATERIAL_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  QUESTION_NOT_FOUND = 'QUESTION_NOT_FOUND',
  
  // Business logic errors
  QUIZ_NOT_ACTIVE = 'QUIZ_NOT_ACTIVE',
  MATERIAL_NOT_ACTIVE = 'MATERIAL_NOT_ACTIVE',
  QUIZ_ATTEMPT_LIMIT_EXCEEDED = 'QUIZ_ATTEMPT_LIMIT_EXCEEDED',
  INVALID_QUIZ_ATTEMPT = 'INVALID_QUIZ_ATTEMPT',
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',
  
  // Authentication/Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  code?: ErrorCode;
}

export class BusinessException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly details?: ErrorDetails;

  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: ErrorDetails
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
    
    this.errorCode = errorCode;
    this.details = details;
  }

  static validation(message: string, details?: ErrorDetails): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.VALIDATION_ERROR,
      HttpStatus.BAD_REQUEST,
      details
    );
  }

  static notFound(resource: string, identifier?: string): BusinessException {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    
    return new BusinessException(
      message,
      this.getNotFoundErrorCode(resource),
      HttpStatus.NOT_FOUND,
      { value: identifier }
    );
  }

  static unauthorized(message: string = 'Unauthorized access'): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED
    );
  }

  static forbidden(message: string = 'Access forbidden'): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.FORBIDDEN,
      HttpStatus.FORBIDDEN
    );
  }

  static internal(message: string = 'Internal server error', details?: ErrorDetails): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details
    );
  }

  static database(message: string, details?: ErrorDetails): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.DATABASE_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details
    );
  }

  static externalService(message: string, details?: ErrorDetails): BusinessException {
    return new BusinessException(
      message,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      HttpStatus.BAD_GATEWAY,
      details
    );
  }

  private static getNotFoundErrorCode(resource: string): ErrorCode {
    switch (resource.toLowerCase()) {
      case 'quiz':
        return ErrorCode.QUIZ_NOT_FOUND;
      case 'material':
        return ErrorCode.MATERIAL_NOT_FOUND;
      case 'user':
        return ErrorCode.USER_NOT_FOUND;
      case 'question':
        return ErrorCode.QUESTION_NOT_FOUND;
      default:
        return ErrorCode.RESOURCE_NOT_FOUND;
    }
  }
}