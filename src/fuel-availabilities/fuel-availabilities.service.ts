import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelAvailability } from './entities/fuel-availability.entity';
import { CreateFuelAvailabilityDto } from './dto/create-fuel-availability.dto';
import { UpdateFuelAvailabilityDto } from './dto/update-fuel-availability.dto';
import { FuelAlertGateway } from 'src/notifications/gateways/fuel-alert.gateway';

@Injectable()
export class FuelAvailabilitiesService {
  private readonly LOW_FUEL_THRESHOLD = 100;
  constructor(
    @InjectRepository(FuelAvailability)
    private readonly fuelAvailabilityRepository: Repository<FuelAvailability>,
    private readonly fuelAlertGateway: FuelAlertGateway,
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
    const availabilityToUpdate = await this.fuelAvailabilityRepository.findOne({
      where: { idFuelAvailability: id },
      relations: ['fuelStation'],
    });

    if (!availabilityToUpdate) {
      return { message: 'No encontrado' };
    }
    await this.fuelAvailabilityRepository.update(id, dto);
    if (
      dto.availableQuantity !== undefined &&
      dto.availableQuantity < this.LOW_FUEL_THRESHOLD
    ) {
      this.fuelAlertGateway.sendLowFuelAlert(
        availabilityToUpdate.fuelStation.idFuelStation,
        dto.availableQuantity,
      );
    }
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

  // paginación
  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.fuelAvailabilityRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['fuelStation', 'fuelType'],
    });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }
}
