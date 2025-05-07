import { Module } from '@nestjs/common';
import { FuelAvailabilitiesService } from './fuel-availabilities.service';
import { FuelAvailabilitiesController } from './fuel-availabilities.controller';

@Module({
  controllers: [FuelAvailabilitiesController],
  providers: [FuelAvailabilitiesService]
})
export class FuelAvailabilitiesModule {}
