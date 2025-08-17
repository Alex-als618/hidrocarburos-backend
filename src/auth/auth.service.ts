import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  comparePassword,
  hashPassword,
} from 'src/common/utils/password-hash.util';
import { JwtPayload } from './interfaces/auth.interfaces';
import { LoginResponseDto, UserProfileDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { ErrorHandlerService } from 'src/common/services/error-handler/error-handler.service';
import { v4 as uuid } from 'uuid';
import { MailService } from 'src/common/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async refreshToken(user: User) {
    const payload: JwtPayload = {
      sub: user.idUser,
      email: user.email,
      role: user.role.roleName,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
    });

    // Rotación (recomendada)
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const hashed = await hashPassword(newRefreshToken);
    await this.usersService.update(user.idUser, { refreshToken: hashed });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken, // si se usa cookie, no lo retornes en el body
      token_type: 'Bearer',
      expires_in: this.getTokenExpirationSeconds(),
    };
  }

  //
  async logout(userId: number) {
    try {
      await this.usersService.update(userId, { refreshToken: undefined });
      return { message: 'Logout successful' };
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  // Construye el objeto de respuesta del login con token y perfil
  private async generateAuthResponse(user: User): Promise<LoginResponseDto> {
    const payload: JwtPayload = {
      sub: user.idUser,
      email: user.email,
      role: user.role.roleName,
    };

    const token = await this.jwtService.signAsync(payload);
    const expiresIn = this.getTokenExpirationSeconds();

    // Generar refresh token
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    // Hashear y guardar refresh token en DB para el usuario
    user.refreshToken = await hashPassword(refreshToken);
    await this.usersService.update(user.idUser, {
      refreshToken: user.refreshToken,
    });

    const userProfile: UserProfileDto = {
      id: user.idUser,
      email: user.email,
      role: user.role.roleName,
    };

    const loginResponse: LoginResponseDto = {
      access_token: token,
      refresh_token: refreshToken, // envías el refresh token en texto plano al cliente
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: userProfile,
    };

    return loginResponse;
  }

  // Convierte el valor de expiración del token a segundos
  private getTokenExpirationSeconds(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const value = parseInt(expiresIn.slice(0, -1));
    const unit = expiresIn.slice(-1);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600; // Valor predeterminado de 1 hora
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const token = uuid();
    user.resetToken = token;
    user.tokenExpiration = new Date(Date.now() + 3600000); // 1 hora

    await this.usersService.update(user.idUser, user);
    await this.mailService.sendPasswordReset(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.usersService.findOneByResetToken(token);

    if (!user) throw new NotFoundException('Token inválido');
    if (user.tokenExpiration < new Date())
      throw new BadRequestException('Token expirado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = '';
    user.tokenExpiration = new Date(0);

    await this.usersService.update(user.idUser, user);

    return 'Contraseña actualizada correctamente';
  }
}
