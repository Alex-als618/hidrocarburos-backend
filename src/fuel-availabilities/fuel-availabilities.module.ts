import { Module } from '@nestjs/common';
import { FuelAvailabilitiesService } from './fuel-availabilities.service';
import { FuelAvailabilitiesController } from './fuel-availabilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelAvailability } from './entities/fuel-availability.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([FuelAvailability]), NotificationsModule],
  exports: [FuelAvailabilitiesService],
  controllers: [FuelAvailabilitiesController],
  providers: [FuelAvailabilitiesService],
})
export class FuelAvailabilitiesModule {}
