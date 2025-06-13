import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
      signOptions: { expiresIn: '1d' }, //Evaluar si se necesita tokens mas largos que 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
