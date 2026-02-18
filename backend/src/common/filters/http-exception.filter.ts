import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let resolvedMessage: string;
    if (isHttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') resolvedMessage = res;
      else {
        const msg = (res as { message?: string | string[] }).message;
        resolvedMessage = Array.isArray(msg) ? msg[0] : (msg ?? 'Unknown error');
      }
    } else {
      resolvedMessage = 'Internal server error';
    }

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${statusCode}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json({
      error: exception instanceof Error ? exception.name : 'Error',
      message: resolvedMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }
}
