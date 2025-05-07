import { Injectable } from '@nestjs/common';
import { CreateFuelAvailabilityDto } from './dto/create-fuel-availability.dto';
import { UpdateFuelAvailabilityDto } from './dto/update-fuel-availability.dto';

@Injectable()
export class FuelAvailabilitiesService {
  create(createFuelAvailabilityDto: CreateFuelAvailabilityDto) {
    return 'This action adds a new fuelAvailability';
  }

  findAll() {
    return `This action returns all fuelAvailabilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fuelAvailability`;
  }

  update(id: number, updateFuelAvailabilityDto: UpdateFuelAvailabilityDto) {
    return `This action updates a #${id} fuelAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} fuelAvailability`;
  }
}
