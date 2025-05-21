import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// Esto captura todas las excepciones que ocurran en la aplicación
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Este método captura cualquier error y lo transforma en una respuesta HTTP estructurada
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Determina el código de estado del error
    // Si es una excepción de NestJS (HttpException), obtiene su código de estado
    // Si no, asigna un error interno del servidor (500)
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Construye la respuesta estructurada con información útil
    let message = 'Internal Server Error';

    // Detecta si la excepción es de validación (BadRequestException)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && response['message']
          ? response['message'] // Muestra los mensajes de validación
          : exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error: exception instanceof HttpException ? exception.name : 'Error',
      message, // Ahora incluirá los mensajes de validación
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
