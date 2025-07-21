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
import { v4 as uuid } from 'uuid';
import { MailService } from 'src/common/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const userExists = await this.usersService.findOneByEmail(email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.idUser,
      email: user.email,
      role: user.role.roleName,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
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
    if (user.tokenExpiration < new Date()) throw new BadRequestException('Token expirado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = '';
    user.tokenExpiration = new Date(0);

    await this.usersService.update(user.idUser, user);

    return 'Contraseña actualizada correctamente';
  }
}
