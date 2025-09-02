import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { Auth } from './decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Autenticación')
//modulo de autenticación maneja el registro y login de usuarios
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //El post/register es el registro publico y el rol siempre es usuario
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado correctamente',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de refresco inválido o expirado',
  })
  refreshToken(@Req() request: { user: User }) {
    return this.authService.refreshToken(request.user);
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión y anular el refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
    schema: { example: { message: 'Sesión cerrada exitosamente' } },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  logout(@Req() request: { user: User }) {
    return this.authService.logout(request.user.idUser);
  }
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string', example: 'usuario@correo.com' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de restablecimiento enviado',
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña usando el token recibido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'abcdef123456' },
        newPassword: { type: 'string', example: 'newPass123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
