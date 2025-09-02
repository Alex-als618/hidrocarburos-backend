import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { getErrorDetails } from './error.util';

// Este decorador indica que el filtro captura cualquier excepción
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Método llamado automáticamente cuando se lanza una excepción dentro del contexto HTTP
  catch(exception: unknown, host: ArgumentsHost): void {
    const httpAdapter: ExpressAdapter = this.httpAdapterHost
      .httpAdapter as ExpressAdapter;
    const ctx = host.switchToHttp(); // Obtiene el contexto HTTP

    const { status, message, errorCode, details } = getErrorDetails(exception);

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error: exception instanceof HttpException ? exception.name : 'Error',
      message,
      errorCode,
      ...(details && { details }), // Solo incluye si existe
    };

    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      responseBody.stack = exception.stack;
    }

    // Envía la respuesta al cliente
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
