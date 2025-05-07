import { Module } from '@nestjs/common';
import { FuelStationsService } from './fuel-stations.service';
import { FuelStationsController } from './fuel-stations.controller';

@Module({
  controllers: [FuelStationsController],
  providers: [FuelStationsService],
})
export class FuelStationsModule {}
