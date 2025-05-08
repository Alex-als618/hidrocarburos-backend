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
  ){}

  async create(dto: CreateFuelAvailabilityDto){
    const availability = this.fuelAvailabilityRepository.create(dto);
    return await this.fuelAvailabilityRepository.save(availability);
  }

  async findAll(){
    return this.fuelAvailabilityRepository.find({
      relations: ['fuelStation', 'fuelType'],
    });
  }

  async findOne(id: number){
    return this.fuelAvailabilityRepository.findOne({
      where: { idFuelAvailability: id },
      relations: ['fuelStation', 'fuelType'],
    });
  }

  update(id: number, updateFuelAvailabilityDto: UpdateFuelAvailabilityDto) {
    return `This action updates a #${id} fuelAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} fuelAvailability`;
  }
}
