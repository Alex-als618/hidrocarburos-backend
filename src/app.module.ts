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
    FuelStationsModule,
    FuelTypesModule,
    FuelAvailabilitiesModule,
    RolesModule,
    UsersModule,
    UserStationNotificationsModule,
    StationImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
