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

//modulo de autenticación maneja el registro y login de usuarios
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //El post/register es el registro publico y el rol siempre es usuario
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() request: { user: User }) {
    return this.authService.refreshToken(request.user);
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: { user: User }) {
    return this.authService.logout(request.user.idUser);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
