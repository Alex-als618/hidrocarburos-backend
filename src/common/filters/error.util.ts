import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  handleDatabaseError,
  isDatabaseError,
} from './error-handlers/database-error.handler';
import {
  handleHttpException,
  isValidationError,
  handleValidationError,
  isEntityValidationError,
  handleEntityValidationError,
  isTransformationError,
  handleTransformationError,
  isTypeOrmError,
  handleTypeOrmError,
  isAuthError,
  handleAuthError,
} from './error-handlers/generic-error.handler';

const logger = new Logger('GlobalErrorHandler');
/**
 * 🧠 ANALIZADOR PRINCIPAL DE ERRORES
 * Determina el tipo de error y extrae información relevante
 */
export function getErrorDetails(exception: unknown): {
  status: number;
  message: string;
  errorCode?: string;
  details?: any;
} {
  // 🔥 ERRORES HTTP DE NESTJS (NotFoundException, BadRequestException, etc.)
  if (exception instanceof HttpException) {
    return handleHttpException(exception);
  }

  // 🔥 ERRORES DE BASE DE DATOS POSTGRESQL
  if (isDatabaseError(exception)) {
    return handleDatabaseError(exception as any);
  }

  // 🔥 ERRORES DE VALIDACIÓN (class-validator)
  if (isValidationError(exception)) {
    return handleValidationError(exception as any);
  }

  // 🔥 ERRORES DE ENTITY (hooks @BeforeInsert, @BeforeUpdate)
  if (isEntityValidationError(exception)) {
    return handleEntityValidationError(exception as Error);
  }

  // 🔥 ERRORES DE TRANSFORMACIÓN (class-transformer)
  if (isTransformationError(exception)) {
    return handleTransformationError(exception as Error);
  }

  // 🔥 ERRORES DE TYPEORM (conexión, consultas)
  if (isTypeOrmError(exception)) {
    return handleTypeOrmError(exception as any);
  }

  // 🔥 ERRORES DE JWT/AUTH
  if (isAuthError(exception)) {
    return handleAuthError(exception as Error);
  }

  logger.error('❗ Error no identificado en la aplicación', exception);

  // 🔥 ERROR GENÉRICO NO IDENTIFICADO
  // this.logger.error('Error no identificado en la aplicación:', exception);
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Error interno del servidor',
    errorCode: 'INTERNAL_ERROR',
  };
}
