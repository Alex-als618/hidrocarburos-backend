import { Injectable } from '@nestjs/common';
import { CreateStationImageDto } from './dto/create-station-image.dto';
import { UpdateStationImageDto } from './dto/update-station-image.dto';

@Injectable()
export class StationImagesService {
  create(createStationImageDto: CreateStationImageDto) {
    return 'This action adds a new stationImage';
  }

  findAll() {
    return `This action returns all stationImages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stationImage`;
  }

  update(id: number, updateStationImageDto: UpdateStationImageDto) {
    return `This action updates a #${id} stationImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} stationImage`;
  }
}
