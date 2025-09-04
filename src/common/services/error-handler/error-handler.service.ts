import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  /**
   * Maneja errores lanzados en los servicios.
   * - Si es una HttpException, la relanza.
   * - Si es un error de base de datos (por código), lanza una excepción adecuada.
   * - Si no se reconoce, lanza error 500 y lo registra.
   */
  public handleError(error: any): void {
    if (error instanceof HttpException) {
      throw error; // Ya es una excepción HTTP, no necesita transformación
    }

    // Error de clave duplicada (PostgreSQL: 23505)
    if (error?.code === '23505') {
      throw new ConflictException(error.detail);
    }

    // Error de referencia inexistente (PostgreSQL: 23503)
    if (error?.code === '23503') {
      throw new BadRequestException('Referenced entity does not exist');
    }

    // Error inesperado: se registra y se lanza excepción genérica
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
