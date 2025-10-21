import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';

@Global()
@Module({
  providers: [
    GlobalExceptionFilter,
    ValidationPipe,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [GlobalExceptionFilter, ValidationPipe],
})
export class SharedModule {}