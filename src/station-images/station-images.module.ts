import { Module } from '@nestjs/common';
import { StationImagesService } from './station-images.service';
import { StationImagesController } from './station-images.controller';

@Module({
  controllers: [StationImagesController],
  providers: [StationImagesService],
})
export class StationImagesModule {}
