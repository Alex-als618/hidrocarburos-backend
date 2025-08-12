import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { FuelStationsModule } from './fuel-stations/fuel-stations.module';
import { StationImagesModule } from './station-images/station-images.module';
import { UserStationNotificationsModule } from './user-station-notifications/user-station-notifications.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { FuelAvailabilitiesModule } from './fuel-availabilities/fuel-availabilities.module';
import { FuelTypesModule } from './fuel-types/fuel-types.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeormConfig,
      inject: [ConfigService],
    }),
    // Configuración del módulo Throttler para la limitación de tasas de peticiones (Rate Limiting).
    // // Limita las peticiones por minuto por cliente, ayudando a prevenir ataques de denegación de servicio (DoS).
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minuto
          limit: 40, // 40 peticiones por minuto
        },
      ],
    }),
    FuelStationsModule,
    FuelTypesModule,
    FuelAvailabilitiesModule,
    RolesModule,
    UsersModule,
    UserStationNotificationsModule,
    StationImagesModule,
    AuthModule,
    TerminusModule,
    HealthModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
