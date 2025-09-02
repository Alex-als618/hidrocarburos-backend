import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 📨 MANEJADOR DE HTTPEXCEPTION
 * Errores lanzados manualmente con throw new NotFoundException(), etc.
 */
export function handleHttpException(exception: HttpException): {
  status: number;
  message: string;
  details?: any;
} {
  const status = exception.getStatus();
  const response = exception.getResponse();

  let message: string;
  let details: any;

  if (typeof response === 'string') {
    message = response;
  } else if (typeof response === 'object' && response !== null) {
    const responseObj = response as any;

    // ✅ Para errores de validación con múltiples mensajes
    if (Array.isArray(responseObj.message)) {
      message = 'Errores de validación';
      details = responseObj.message;
    } else {
      message = responseObj.message || responseObj.error || exception.message;
      details = responseObj.details;
    }
  } else {
    message = exception.message;
  }

  return { status, message, details };
}

/**
 * ✅ DETECTOR DE ERRORES DE VALIDACIÓN
 */
export function isValidationError(exception: any): boolean {
  if (Array.isArray(exception)) {
    return exception.every((e) => 'property' in e && 'constraints' in e);
  }

  if (!(exception instanceof Error)) return false;

  const validationIndicators = [
    'ValidationError',
    'validate',
    'validation failed',
    'Bad Request Exception',
  ];

  return validationIndicators.some(
    (indicator) =>
      exception.name.includes(indicator) ||
      exception.message.toLowerCase().includes(indicator.toLowerCase()),
  );
}

/**
 * 📋 MANEJADOR DE ERRORES DE VALIDACIÓN
 */
export function handleValidationError(error: Error): {
  status: number;
  message: string;
  errorCode: string;
  details?: any;
} {
  return {
    status: HttpStatus.BAD_REQUEST,
    message: 'Los datos enviados no son válidos',
    errorCode: 'VALIDATION_ERROR',
    details: error.message,
  };
}

/**
 * 🏗️ DETECTOR DE ERRORES DE ENTITY
 */
export function isEntityValidationError(exception: unknown): boolean {
  if (!(exception instanceof Error)) return false;

  const entityErrorIndicators = [
    'El porcentaje debe estar entre',
    'El monto fijo debe ser mayor',
    'Percentage must be between',
    'Fixed amount must be greater',
    'must be between',
    'greater than',
    'less than',
  ];

  return entityErrorIndicators.some((indicator) =>
    exception.message.includes(indicator),
  );
}

/**
 * 🏗️ MANEJADOR DE ERRORES DE ENTITY
 */
export function handleEntityValidationError(error: Error): {
  status: number;
  message: string;
  errorCode: string;
} {
  return {
    status: HttpStatus.BAD_REQUEST,
    message: error.message,
    errorCode: 'ENTITY_VALIDATION_ERROR',
  };
}

/**
 * 🔄 DETECTOR DE ERRORES DE TRANSFORMACIÓN
 */
export function isTransformationError(exception: unknown): boolean {
  if (!(exception instanceof Error)) return false;

  return (
    exception.name.includes('Transform') ||
    exception.message.includes('transform') ||
    exception.message.includes('convert') ||
    exception.message.includes('cast')
  );
}

/**
 * 🔄 MANEJADOR DE ERRORES DE TRANSFORMACIÓN
 */
export function handleTransformationError(error: Error): {
  status: number;
  message: string;
  errorCode: string;
} {
  return {
    status: HttpStatus.BAD_REQUEST,
    message: 'Error en la transformación de datos',
    errorCode: 'TRANSFORMATION_ERROR',
  };
}

/**
 * 🔍 DETECTOR DE ERRORES DE TYPEORM
 */
export function isTypeOrmError(exception: unknown): boolean {
  if (!(exception instanceof Error)) return false;

  return (
    exception.name.includes('TypeORM') ||
    exception.name.includes('QueryFailed') ||
    exception.name.includes('Repository') ||
    exception.message.includes('relation') ||
    exception.message.includes('entity')
  );
}

/**
 * 🔍 MANEJADOR DE ERRORES DE TYPEORM
 */
export function handleTypeOrmError(error: any): {
  status: number;
  message: string;
  errorCode: string;
} {
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Error en la consulta a la base de datos',
    errorCode: 'TYPEORM_ERROR',
  };
}

/**
 * 🔐 DETECTOR DE ERRORES DE AUTENTICACIÓN/AUTORIZACIÓN
 */
export function isAuthError(exception: unknown): boolean {
  if (!(exception instanceof Error)) return false;

  const authErrorIndicators = [
    'Unauthorized',
    'Forbidden',
    'jwt',
    'token',
    'authentication',
    'authorization',
    'JsonWebToken',
  ];

  return authErrorIndicators.some(
    (indicator) =>
      exception.name.includes(indicator) ||
      exception.message.toLowerCase().includes(indicator.toLowerCase()),
  );
}

/**
 * 🔐 MANEJADOR DE ERRORES DE AUTH
 */
export function handleAuthError(error: Error): {
  status: number;
  message: string;
  errorCode: string;
} {
  if (error.message.includes('jwt') || error.message.includes('token')) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Token de autenticación inválido o expirado',
      errorCode: 'INVALID_TOKEN',
    };
  }

  if (error.message.toLowerCase().includes('unauthorized')) {
    return {
      status: HttpStatus.UNAUTHORIZED,
      message: 'Credenciales de acceso inválidas',
      errorCode: 'UNAUTHORIZED',
    };
  }

  if (error.message.toLowerCase().includes('forbidden')) {
    return {
      status: HttpStatus.FORBIDDEN,
      message: 'No tienes permisos para realizar esta acción',
      errorCode: 'FORBIDDEN',
    };
  }

  return {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Error de autenticación',
    errorCode: 'AUTH_ERROR',
  };
}
