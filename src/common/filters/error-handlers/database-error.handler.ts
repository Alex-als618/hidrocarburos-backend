import { HttpStatus } from '@nestjs/common';

/**
 * 🔍 DETECTOR DE ERRORES DE BASE DE DATOS
 */
export function isDatabaseError(exception: any): boolean {
  return (
    exception &&
    typeof exception === 'object' &&
    'code' in exception! &&
    typeof (exception as any).code === 'string'
  );
}

/**
 * 🗄️ MANEJADOR DE ERRORES DE POSTGRESQL
 * Convierte códigos de error PostgreSQL a mensajes específicos para tu proyecto
 */
export function handleDatabaseError(error: any): {
  status: number;
  message: string;
  errorCode: string;
} {
  switch (error.code) {
    // ✅ VIOLACIÓN DE CONSTRAINT ÚNICO (duplicados)
    case '23505':
      return {
        status: HttpStatus.CONFLICT,
        message: getUniqueViolationMessage(error),
        errorCode: 'DUPLICATE_ENTRY',
      };

    // ✅ VIOLACIÓN DE FOREIGN KEY
    case '23503':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: getForeignKeyViolationMessage(error),
        errorCode: 'FOREIGN_KEY_VIOLATION',
      };

    // ✅ CAMPO REQUERIDO NULO
    case '23502':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: getNullViolationMessage(error),
        errorCode: 'MISSING_REQUIRED_FIELDS',
      };

    // ✅ DATOS DEMASIADO LARGOS
    case '22001':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Los datos son demasiado largos para el campo',
        errorCode: 'DATA_TOO_LONG',
      };

    // ✅ VIOLACIÓN DE CHECK CONSTRAINT
    case '23514':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Los datos no cumplen las restricciones definidas',
        errorCode: 'CHECK_VIOLATION',
      };

    // ✅ TIPO DE DATO INVÁLIDO
    case '22P02':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Tipo de dato inválido en la consulta',
        errorCode: 'INVALID_DATA_TYPE',
      };

    // ✅ DIVISIÓN POR CERO
    case '22012':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'División por cero en operación matemática',
        errorCode: 'DIVISION_BY_ZERO',
      };

    // ✅ CONEXIÓN PERDIDA
    case '08006':
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Conexión con la base de datos perdida',
        errorCode: 'CONNECTION_LOST',
      };

    // ✅ ERROR NO MANEJADO ESPECÍFICAMENTE
    default:
      this.logger.error('Error de base de datos no manejado:', {
        code: error.code,
        message: error.message,
        detail: error.detail,
        constraint: error.constraint,
      });
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en la base de datos',
        errorCode: 'DATABASE_ERROR',
      };
  }
}

/**
 * 📝 GENERADOR DE MENSAJES ESPECÍFICOS PARA CONSTRAINT ÚNICO
 * Basado en tus entities específicas
 */
export function getUniqueViolationMessage(error: any): string {
  const detail = error.detail || '';
  const constraint = error.constraint || '';

  // ✅ USERS - Email duplicado
  if (detail.includes('email') || constraint.includes('email')) {
    return 'Ya existe un usuario registrado con este email';
  }

  // ✅ USERS - Documento duplicado
  if (
    detail.includes('document_number') ||
    constraint.includes('document_number')
  ) {
    return 'Ya existe un usuario con este número de documento';
  }

  // ✅ PRODUCTS - Nombre duplicado
  if (
    detail.includes('products') &&
    (detail.includes('name') || constraint.includes('name'))
  ) {
    return 'Ya existe un producto con este nombre';
  }

  // ✅ PRODUCTS - Slug duplicado
  if (detail.includes('slug') || constraint.includes('slug')) {
    return 'Ya existe un producto con esta URL (slug)';
  }

  // ✅ CATEGORIES - Nombre duplicado
  if (
    detail.includes('categories') &&
    (detail.includes('name') || constraint.includes('name'))
  ) {
    return 'Ya existe una categoría con este nombre';
  }

  // ✅ ROLES - Nombre duplicado
  if (
    detail.includes('roles') &&
    (detail.includes('name') || constraint.includes('name'))
  ) {
    return 'Ya existe un rol con este nombre';
  }

  // ✅ Mensaje genérico
  return 'Ya existe un registro con estos datos';
}

/**
 * 🔗 GENERADOR DE MENSAJES PARA FOREIGN KEY
 */
export function getForeignKeyViolationMessage(error: any): string {
  const detail = error.detail || '';
  const constraint = error.constraint || '';

  if (constraint.includes('category') || detail.includes('category')) {
    return 'La categoría especificada no existe';
  }

  if (constraint.includes('role') || detail.includes('role')) {
    return 'El rol especificado no existe';
  }

  if (constraint.includes('product') || detail.includes('product')) {
    return 'El producto especificado no existe';
  }

  if (constraint.includes('user') || detail.includes('user')) {
    return 'El usuario especificado no existe';
  }

  return 'Referencia a datos que no existen en el sistema';
}

/**
 * ❌ GENERADOR DE MENSAJES PARA CAMPOS NULOS
 */
export function getNullViolationMessage(error: any): string {
  const column = error.column || '';

  const fieldMessages: Record<string, string> = {
    email: 'El email es obligatorio',
    password: 'La contraseña es obligatoria',
    full_name: 'El nombre completo es obligatorio',
    document_number: 'El número de documento es obligatorio',
    name: 'El nombre es obligatorio',
    price: 'El precio es obligatorio',
    category_id: 'La categoría es obligatoria',
    role_id: 'El rol es obligatorio',
  };

  return fieldMessages[column] || `El campo ${column} es obligatorio`;
}
