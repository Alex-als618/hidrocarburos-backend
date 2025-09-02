import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Length,
  Matches,
  IsPositive,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  @Transform(({ value }) => value?.toString().trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
  @Transform(({ value }) => value?.toString().trim())
  lastName?: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'juan.perez@email.com',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @Transform(({ value }) => value?.toString().toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Transform(({ value }) => value?.toString().trim())
  password: string;

  @ApiHideProperty()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+59170123456',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  @Matches(/^(\+\d{1,4})?[\s-]?\d{6,15}$/, {
    message: 'Formato inválido. Ejemplos: +59170123456, 70123456',
  })
  @Transform(({ value }) => value?.toString().replace(/[\s-]/g, '').trim())
  phone?: string;

  @ApiPropertyOptional({
    description: 'ID del rol asignado',
    example: 1,
  })
  @IsInt({ message: 'El ID del rol debe ser un número entero' })
  @IsOptional()
  idRole?: number;

  @ApiPropertyOptional({
    description: 'ID de la estación de servicio asignada',
    example: 5,
  })
  @IsInt({ message: 'El ID de la estación debe ser un número entero' })
  @IsPositive({ message: 'El ID de la estación debe ser un número positivo' })
  @IsOptional()
  idFuelStation?: number;
}
