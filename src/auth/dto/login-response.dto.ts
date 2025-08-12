import { IsNumber, IsString } from 'class-validator';

// DTO para la información del perfil de usuario que se envía al cliente
export class UserProfileDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  role: string;
}

// DTO para la respuesta completa del login
export class LoginResponseDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsString()
  token_type: string;

  @IsNumber()
  expires_in: number;

  user: UserProfileDto;
}
