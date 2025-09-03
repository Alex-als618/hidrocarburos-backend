import { HttpStatus, Logger } from '@nestjs/common';

export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02',
  DIVISION_BY_ZERO: '22012',
  CONNECTION_FAILURE: '08006',
} as const;

type PostgresErrorCode =
  (typeof POSTGRES_ERROR_CODES)[keyof typeof POSTGRES_ERROR_CODES];

interface DatabaseErrorResponse {
  status: number;
  message: string;
  errorCode: string;
}

const logger = new Logger('DatabaseErrorHandler');

export function isDatabaseError(
  exception: unknown,
): exception is Record<string, unknown> {
  return (
    typeof exception === 'object' &&
    exception !== null &&
    'code' in exception &&
    typeof (exception as Record<string, unknown>).code === 'string'
  );
}

// Mensajes por constraint únicos
const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
  users_email_key: 'Ya existe un usuario registrado con este email',
  fuel_types_fuel_name_key: 'Ya existe un tipo de combustible con este nombre',
  fuel_stations_name_key: 'Ya existe una estación con este nombre',
  user_station_notifications_id_user_id_fuel_station_key:
    'Ya existe una suscripción para este usuario y estación',
  fuel_availability_id_fuel_station_id_fuel_type_key:
    'Ya existe una disponibilidad registrada para esta estación y tipo de combustible',
};

// Mensajes de foreign key
const FOREIGN_KEY_MESSAGES: Record<string, string> = {
  users_id_role_fkey: 'El rol especificado no existe',
  users_id_fuel_station_fkey: 'La estación asignada al usuario no existe',
  fuel_availability_id_fuel_station_fkey: 'La estación especificada no existe',
  fuel_availability_id_fuel_type_fkey:
    'El tipo de combustible especificado no existe',
  station_images_id_fuel_station_fkey: 'La estación de la imagen no existe',
};

// Campos NOT NULL
const NOT_NULL_MESSAGES: Record<string, string> = {
  name: 'El nombre es obligatorio',
  email: 'El email es obligatorio',
  password: 'La contraseña es obligatoria',
  fuel_name: 'El nombre del combustible es obligatorio',
  available_quantity: 'La cantidad disponible es obligatoria',
  id_fuel_station: 'La estación de servicio es obligatoria',
  id_fuel_type: 'El tipo de combustible es obligatorio',
  id_role: 'El rol es obligatorio',
};

export function handleDatabaseError(
  error: Record<string, unknown>,
): DatabaseErrorResponse {
  const code = error.code as PostgresErrorCode;
  const constraint = (error.constraint as string) || '';
  const column = (error.column as string) || '';

  const handlers: Partial<
    Record<PostgresErrorCode, () => DatabaseErrorResponse>
  > = {
    [POSTGRES_ERROR_CODES.UNIQUE_VIOLATION]: () => ({
      status: HttpStatus.CONFLICT,
      message: getMessage(
        UNIQUE_CONSTRAINT_MESSAGES,
        constraint,
        'Registro duplicado',
      ),
      errorCode: 'DUPLICATE_ENTRY',
    }),

    [POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: getMessage(
        FOREIGN_KEY_MESSAGES,
        constraint,
        'Referencia a datos inexistentes',
      ),
      errorCode: 'FOREIGN_KEY_VIOLATION',
    }),

    [POSTGRES_ERROR_CODES.NOT_NULL_VIOLATION]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: getMessage(
        NOT_NULL_MESSAGES,
        column,
        `El campo ${column} es obligatorio`,
      ),
      errorCode: 'MISSING_REQUIRED_FIELDS',
    }),

    [POSTGRES_ERROR_CODES.STRING_DATA_RIGHT_TRUNCATION]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: 'Los datos son demasiado largos para el campo',
      errorCode: 'DATA_TOO_LONG',
    }),

    [POSTGRES_ERROR_CODES.CHECK_VIOLATION]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: 'Los datos no cumplen las restricciones definidas',
      errorCode: 'CHECK_VIOLATION',
    }),

    [POSTGRES_ERROR_CODES.INVALID_TEXT_REPRESENTATION]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: 'Tipo de dato inválido en la consulta',
      errorCode: 'INVALID_DATA_TYPE',
    }),

    [POSTGRES_ERROR_CODES.DIVISION_BY_ZERO]: () => ({
      status: HttpStatus.BAD_REQUEST,
      message: 'División por cero en operación matemática',
      errorCode: 'DIVISION_BY_ZERO',
    }),

    [POSTGRES_ERROR_CODES.CONNECTION_FAILURE]: () => ({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Conexión con la base de datos perdida',
      errorCode: 'CONNECTION_LOST',
    }),
  };

  const handler = handlers[code];

  if (handler) {
    return handler();
  }

  logger.error('Error de base de datos no manejado', {
    code,
    message: error.message,
    detail: error.detail,
    constraint,
  });

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Error en la base de datos',
    errorCode: 'DATABASE_ERROR',
  };
}

function getMessage(
  map: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return map[key] || fallback;
}
