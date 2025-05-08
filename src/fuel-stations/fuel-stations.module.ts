import { Module } from '@nestjs/common';
import { FuelStationsService } from './fuel-stations.service';
import { FuelStationsController } from './fuel-stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelStation } from './entities/fuel-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelStation])],
  controllers: [FuelStationsController],
  providers: [FuelStationsService],
})
export class FuelStationsModule {}
