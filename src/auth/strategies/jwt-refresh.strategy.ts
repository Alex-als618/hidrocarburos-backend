import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/auth.interfaces';
import { Request } from 'express';
import { comparePassword } from 'src/common/utils/password-hash.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { sub: userId } = payload;
    const refreshToken = req.body.refresh_token as string;

    const user = await this.userRepository.findOne({
      where: { idUser: userId },
      relations: ['role'], // necesario para refreshToken()
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // Comparar el refresh token del request con el hasheado en DB
    const isRefreshTokenMatching = await comparePassword(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Access Denied');
    }

    // Si todo está bien, Passport adjuntará el usuario al request
    return user;
  }
}
