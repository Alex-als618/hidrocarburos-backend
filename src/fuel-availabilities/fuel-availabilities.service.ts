import { Injectable } from '@nestjs/common';
import { CreateFuelAvailabilityDto } from './dto/create-fuel-availability.dto';
import { UpdateFuelAvailabilityDto } from './dto/update-fuel-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelAvailability } from './entities/fuel-availability.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuelAvailabilitiesService {
  constructor(
    @InjectRepository(FuelAvailability)
    private readonly fuelAvailabilityRepository: Repository<FuelAvailability>,
  ) {}

  async create(dto: CreateFuelAvailabilityDto) {
    const availability = this.fuelAvailabilityRepository.create(dto);
    return await this.fuelAvailabilityRepository.save(availability);
  }

  async findAll() {
    return await this.fuelAvailabilityRepository.find({
      relations: ['fuelStation', 'fuelType'],
    });
  }

  async findOne(id: number) {
    return await this.fuelAvailabilityRepository.findOne({
      where: { idFuelAvailability: id },
      relations: ['fuelStation', 'fuelType'],
    });
  }

  async update(id: number, dto: UpdateFuelAvailabilityDto) {
    await this.fuelAvailabilityRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const toDelete = await this.findOne(id);
    if (toDelete) {
      await this.fuelAvailabilityRepository.remove(toDelete);
      return { message: 'Eliminado correctamente' };
    }
    return { message: 'No encontrado' };
  }
}
