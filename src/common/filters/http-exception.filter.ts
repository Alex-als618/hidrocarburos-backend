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
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal Server Error',
    };

    // Envía la respuesta al cliente con el código de estado y los detalles del error
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
