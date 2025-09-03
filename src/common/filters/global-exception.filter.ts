// src/common/filters/global-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  isDatabaseError,
  handleDatabaseError,
} from './error-handlers/database-error.handler';
import {
  handleGenericError,
  GenericErrorResponse,
} from './error-handlers/generic-error.handler';

/**
 * Filtro global que atrapa cualquier excepción no manejada y la convierte en una respuesta HTTP estandarizada.
 * Toda la lógica de interpretación de errores está delegada a handlers externos.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // ✅ Delegamos el análisis del error completamente a los handlers
    const errorResponse: GenericErrorResponse = isDatabaseError(exception)
      ? handleDatabaseError(exception)
      : handleGenericError(exception);

    // 📝 Construir cuerpo de la respuesta
    const responseBody: Record<string, unknown> = {
      statusCode: errorResponse.status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: errorResponse.message,
      errorCode: errorResponse.errorCode,
      ...(errorResponse.details ? { details: errorResponse.details } : {}),
    };

    // 🛠️ Solo mostrar stack trace en desarrollo para debugging
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      responseBody.debug = {
        name: exception.name,
        stack: this.formatStack(exception.stack),
      };
    }

    // 📦 Logguear el error de manera adecuada según su tipo
    this.logError(exception, errorResponse);

    // 📤 Enviar respuesta al cliente
    httpAdapter.reply(ctx.getResponse(), responseBody, errorResponse.status);
  }

  /**
   * Loguea el error con el nivel adecuado según su severidad.
   */
  private logError(
    exception: unknown,
    errorResponse: GenericErrorResponse,
  ): void {
    const stack = exception instanceof Error ? exception.stack : undefined;
    const context = `[${errorResponse.errorCode}] ${errorResponse.message}`;

    if (errorResponse.status >= 500) {
      this.logger.error(`❗ ${context}`, stack);
    } else if (errorResponse.status >= 400) {
      this.logger.warn(`⚠️ ${context}`);
    } else {
      this.logger.log(`ℹ️ ${context}`);
    }
  }

  /**
   * Formatea el stack trace para que sea más legible y seguro.
   */
  private formatStack(stack?: string): string[] {
    if (!stack) return [];
    return stack
      .split('\n') // Separar por líneas
      .map((line) => line.trim()) // Quitar espacios extra
      .filter((line) => line) // Quitar líneas vacías
      .map((line) => line.replace(process.cwd(), '')) // Quitar ruta absoluta del proyecto
      .slice(0, 5); // Limitar a las primeras 5 líneas
  }
}
