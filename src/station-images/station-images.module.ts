import { Module } from '@nestjs/common';
import { StationImagesService } from './station-images.service';
import { StationImagesController } from './station-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationImage } from './entities/station-image.entity';
import { FuelStation } from 'src/fuel-stations/entities/fuel-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StationImage, FuelStation])],
  exports: [StationImagesService],
  controllers: [StationImagesController],
  providers: [StationImagesService],
})
export class StationImagesModule {}
