import { Injectable, NotFoundException } from '@nestjs/common';
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
    const station = this.stationRepository.create(dto);
    return await this.stationRepository.save(station);
  }

  async findAll() {
    return await this.stationRepository.find({
      relations: ['fuelAvailabilities', 'stationImages'],
    });
  }

  async findOne(id: number) {
    const station = await this.stationRepository.findOne({
      where: { idFuelStation: id },
      relations: ['fuelAvailabilities', 'stationImages'],
    });

    if (!station) {
      throw new NotFoundException(`FuelStation #${id} not found`);
    }

    return station;
  }

  async update(id: number, dto: UpdateFuelStationDto) {
    const station = await this.findOne(id);
    const updated = Object.assign(station, dto);
    return await this.stationRepository.save(updated);
  }

  async remove(id: number) {
    const result = await this.stationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`FuelStation #${id} not found`);
    }
    return { message: `FuelStation #${id} deleted` };
  }
}
