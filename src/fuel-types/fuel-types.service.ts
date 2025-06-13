import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelType } from './entities/fuel-type.entity';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

@Injectable()
export class FuelTypesService {
  constructor(
    @InjectRepository(FuelType)
    private readonly fuelTypeRepository: Repository<FuelType>,
  ) {}

  async create(createFuelTypeDto: CreateFuelTypeDto): Promise<FuelType> {
    // Puedes usar save directamente con el DTO
    return await this.fuelTypeRepository.save(createFuelTypeDto);
  }

  async findAll(): Promise<FuelType[]> {
    return await this.fuelTypeRepository.find({
      relations: ['fuelAvailabilities'],
    });
  }

  async findOne(id: number): Promise<FuelType | null> {
    return await this.fuelTypeRepository.findOne({
      where: { idFuelType: id },
      relations: ['fuelAvailabilities'],
    });
  }

  async update(
    id: number,
    updateFuelTypeDto: UpdateFuelTypeDto,
  ): Promise<FuelType | null> {
    await this.fuelTypeRepository.update(id, updateFuelTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const toDelete = await this.findOne(id);
    if (toDelete) {
      await this.fuelTypeRepository.remove(toDelete);
      return { message: 'Eliminado correctamente' };
    }
    return { message: 'No encontrado' };
  }
}
