import { Injectable, NotFoundException } from '@nestjs/common';
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
    const availability = await this.fuelAvailabilityRepository.findOne({
      where: { idFuelAvailability: id },
      relations: ['fuelStation', 'fuelType'],
    });

    if (!availability) {
      throw new NotFoundException(`FuelAvailability #${id} not found`);
    }

    return availability;
  }

  async update(id: number, dto: UpdateFuelAvailabilityDto) {
    const existing = await this.findOne(id);

    const isQuantityChanged =
      dto.availableQuantity !== undefined &&
      dto.availableQuantity !== existing.availableQuantity;

    if (isQuantityChanged && dto.availableQuantity !== undefined) {
      existing.availableQuantity = dto.availableQuantity;
      existing.updatedAt = new Date();
      return await this.fuelAvailabilityRepository.save(existing);
    }

    return existing;
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
