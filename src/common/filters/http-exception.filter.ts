import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// Este decorador indica que el filtro captura cualquier excepción
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Método llamado automáticamente cuando se lanza una excepción dentro del contexto HTTP
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp(); // Obtiene el contexto HTTP

    // Determina el código de estado HTTP
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Mensaje por defecto
    let message = 'Internal Server Error';

    // Si es una excepción conocida (HttpException), extrae el mensaje
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && response['message']
          ? response['message'] // Muestra mensajes de validación si existen
          : exception.message;
    }

    // Construye el cuerpo de la respuesta
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error: exception instanceof HttpException ? exception.name : 'Error',
      message,
    };

    // Envía la respuesta al cliente
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}