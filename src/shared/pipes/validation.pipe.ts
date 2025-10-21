import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BusinessException, ErrorCode } from '../exceptions/business.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = this.buildErrorMessages(errors);
      throw BusinessException.validation(
        'Validation failed',
        {
          code: ErrorCode.VALIDATION_ERROR,
          constraint: 'validation_failed',
        }
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private buildErrorMessages(errors: any[]): string[] {
    const messages: string[] = [];
    
    errors.forEach(error => {
      if (error.constraints) {
        messages.push(...Object.values(error.constraints as Record<string, string>));
      }
      
      if (error.children && error.children.length > 0) {
        messages.push(...this.buildErrorMessages(error.children));
      }
    });

    return messages;
  }
}
