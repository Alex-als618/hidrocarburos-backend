import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario para iniciar sesión',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @Transform(({ value }) => value?.toString().toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Matches(/\S/, { message: 'La contraseña no puede contener solo espacios' })
  @Transform(({ value }) => value.trim())
  password: string;
}
