// src/common/filters/error-handlers/generic-error.handler.ts
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

// ---------- Interfaces ----------
export interface GenericErrorResponse {
  status: number;
  message: string;
  errorCode: string;
  details?: unknown;
}

// ---------- Constantes ----------
const ERROR_CODES = {
  HTTP: 'HTTP_EXCEPTION',
  VALIDATION: 'VALIDATION_ERROR',
  ENTITY_VALIDATION: 'ENTITY_VALIDATION_ERROR',
  TRANSFORM: 'TRANSFORMATION_ERROR',
  TYPEORM: 'TYPEORM_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  AUTH: 'AUTH_ERROR',
  INTERNAL: 'INTERNAL_ERROR',
} as const;

const logger = new Logger('GenericErrorHandler');

// ---------- Helpers ----------
function matchesIndicators(exception: Error, indicators: string[]): boolean {
  const name = exception.name.toLowerCase();
  const msg = exception.message.toLowerCase();
  return indicators.some(
    (i) => name.includes(i.toLowerCase()) || msg.includes(i.toLowerCase()),
  );
}

function buildResponse(
  status: number,
  message: string,
  errorCode: string,
  details?: unknown,
): GenericErrorResponse {
  return {
    status,
    message,
    errorCode,
    ...(details ? { details } : {}),
  };
}

// ---------- Handlers ----------
export function handleHttpException(
  exception: HttpException,
): GenericErrorResponse {
  const status = exception.getStatus();
  const response = exception.getResponse();

  let message: string;
  let details: unknown;

  if (typeof response === 'string') {
    message = response;
  } else if (typeof response === 'object' && response !== null) {
    const resObj = response as Record<string, unknown>;
    if (Array.isArray(resObj.message)) {
      message = 'Errores de validación';
      details = resObj.message;
    } else {
      message =
        (resObj.message as string) ||
        (resObj.error as string) ||
        exception.message;
      details = resObj.details;
    }
  } else {
    message = exception.message;
  }

  return buildResponse(status, message, ERROR_CODES.HTTP, details);
}

export function handleValidationError(error: Error): GenericErrorResponse {
  return buildResponse(
    HttpStatus.BAD_REQUEST,
    'Los datos enviados no son válidos',
    ERROR_CODES.VALIDATION,
    error.message,
  );
}

export function handleEntityValidationError(
  error: Error,
): GenericErrorResponse {
  return buildResponse(
    HttpStatus.BAD_REQUEST,
    error.message,
    ERROR_CODES.ENTITY_VALIDATION,
  );
}

export function handleTransformationError(error: Error): GenericErrorResponse {
  return buildResponse(
    HttpStatus.BAD_REQUEST,
    'Error en la transformación de datos',
    ERROR_CODES.TRANSFORM,
    error.message,
  );
}

export function handleTypeOrmError(error: Error): GenericErrorResponse {
  return buildResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error en la consulta a la base de datos',
    ERROR_CODES.TYPEORM,
    error.message,
  );
}

export function handleAuthError(error: Error): GenericErrorResponse {
  const msg = error.message.toLowerCase();

  if (msg.includes('jwt') || msg.includes('token')) {
    return buildResponse(
      HttpStatus.UNAUTHORIZED,
      'Token de autenticación inválido o expirado',
      ERROR_CODES.INVALID_TOKEN,
    );
  }
  if (msg.includes('unauthorized')) {
    return buildResponse(
      HttpStatus.UNAUTHORIZED,
      'Credenciales de acceso inválidas',
      ERROR_CODES.UNAUTHORIZED,
    );
  }
  if (msg.includes('forbidden')) {
    return buildResponse(
      HttpStatus.FORBIDDEN,
      'No tienes permisos para realizar esta acción',
      ERROR_CODES.FORBIDDEN,
    );
  }
  return buildResponse(
    HttpStatus.UNAUTHORIZED,
    'Error de autenticación',
    ERROR_CODES.AUTH,
  );
}

// ---------- Mapa de detección ----------
type HandlerEntry = {
  check: (e: Error) => boolean;
  handle: (e: Error) => GenericErrorResponse;
};

const HANDLERS: HandlerEntry[] = [
  {
    check: (e) => e instanceof HttpException,
    handle: (e) => handleHttpException(e as HttpException),
  },
  {
    check: (e) =>
      matchesIndicators(e, ['ValidationError', 'Bad Request Exception']),
    handle: handleValidationError,
  },
  {
    check: (e) =>
      matchesIndicators(e, ['must be between', 'greater than', 'less than']),
    handle: handleEntityValidationError,
  },
  {
    check: (e) => matchesIndicators(e, ['transform', 'convert', 'cast']),
    handle: handleTransformationError,
  },
  {
    check: (e) =>
      matchesIndicators(e, [
        'TypeORM',
        'QueryFailed',
        'Repository',
        'relation',
        'entity',
      ]),
    handle: handleTypeOrmError,
  },
  {
    check: (e) =>
      matchesIndicators(e, [
        'Unauthorized',
        'Forbidden',
        'jwt',
        'token',
        'authentication',
        'authorization',
        'JsonWebToken',
      ]),
    handle: handleAuthError,
  },
];

// ---------- Punto de entrada ----------
export function handleGenericError(exception: unknown): GenericErrorResponse {
  if (!(exception instanceof Error)) {
    return buildResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Error interno del servidor',
      ERROR_CODES.INTERNAL,
    );
  }

  const found = HANDLERS.find((h) => h.check(exception));
  if (found) return found.handle(exception);

  logger.error('Unhandled exception', {
    name: exception.name,
    message: exception.message,
    stack: exception.stack,
  });

  return buildResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
    ERROR_CODES.INTERNAL,
  );
}
