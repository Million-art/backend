import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '../logs/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else {
        message = res.message || message;
        details = res.message instanceof Array ? res.message : [];
      }

      errorCode = res.error || HttpStatus[status];
    }
    //logger
    this.logger.error(message, (exception as any).stack, request.url);

    response.status(status).json({
      statusCode: status,
      error: errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
