import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StationImagesService } from './station-images.service';
import { CreateStationImageDto } from './dto/create-station-image.dto';
import { UpdateStationImageDto } from './dto/update-station-image.dto';

@Controller('station-images')
export class StationImagesController {
  constructor(private readonly stationImagesService: StationImagesService) {}

  @Post()
  create(@Body() createStationImageDto: CreateStationImageDto) {
    return this.stationImagesService.create(createStationImageDto);
  }

  @Get()
  findAll() {
    return this.stationImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStationImageDto: UpdateStationImageDto) {
    return this.stationImagesService.update(+id, updateStationImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationImagesService.remove(+id);
  }
}
