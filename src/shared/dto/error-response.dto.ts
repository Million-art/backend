import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '../exceptions/business.exception';

export class ErrorDetailsDto {
  @ApiProperty({ description: 'Field that caused the error', required: false })
  field?: string;

  @ApiProperty({ description: 'Value that caused the error', required: false })
  value?: any;

  @ApiProperty({ description: 'Validation constraint that failed', required: false })
  constraint?: string;

  @ApiProperty({ description: 'Error code', required: false })
  code?: ErrorCode;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Quiz not found' })
  message: string;

  @ApiProperty({ description: 'Error code', enum: ErrorCode, example: ErrorCode.QUIZ_NOT_FOUND })
  errorCode: ErrorCode;

  @ApiProperty({ description: 'Additional error details', type: ErrorDetailsDto, required: false })
  details?: ErrorDetailsDto;

  @ApiProperty({ description: 'Timestamp when error occurred', example: '2024-01-20T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Request path', example: '/api/quizzes/123', required: false })
  path?: string;

  @ApiProperty({ description: 'Request method', example: 'GET', required: false })
  method?: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Validation errors', 
    type: [String],
    example: ['title is required', 'difficulty must be one of: easy, medium, hard']
  })
  validationErrors?: string[];
}
