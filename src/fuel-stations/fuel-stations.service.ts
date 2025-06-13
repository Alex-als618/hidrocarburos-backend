import { Injectable } from '@nestjs/common';
import { CreateFuelStationDto } from './dto/create-fuel-station.dto';
import { UpdateFuelStationDto } from './dto/update-fuel-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelStation } from './entities/fuel-station.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuelStationsService {
  constructor(
    @InjectRepository(FuelStation)
    private readonly stationRepository: Repository<FuelStation>,
  ) {}

  async create(dto: CreateFuelStationDto) {
    //const station = this.stationRepository.create(dto);
    return /*await this.stationRepository.save(station)*/ 'prueba create';
  }

  async findAll() {
    return /*this.stationRepository.find()*/ 'prueba findAll';
  }

  findOne(id: number) {
    return `This action returns a #${id} fuelStation`;
  }

  update(id: number, updateFuelStationDto: UpdateFuelStationDto) {
    return `This action updates a #${id} fuelStation`;
  }

  remove(id: number) {
    return `This action removes a #${id} fuelStation`;
  }
}
