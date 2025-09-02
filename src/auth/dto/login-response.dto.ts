import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

// DTO para la información del perfil de usuario que se envía al cliente
export class UserProfileDto {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'USER' })
  @IsString()
  role: string;
}

// DTO para la respuesta completa del login
export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1Ni...',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Token de refresco JWT',
    example: 'eyJhbGciOiJIUzI1Ni...',
  })
  @IsString()
  refresh_token: string;

  @ApiProperty({ description: 'Tipo de token', example: 'Bearer' })
  @IsString()
  token_type: string;

  @ApiProperty({
    description: 'Tiempo de expiración del token de acceso en segundos',
    example: 3600,
  })
  @IsPositive()
  expires_in: number;

  @ApiProperty({
    description: 'Información del perfil de usuario',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
