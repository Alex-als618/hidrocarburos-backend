import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelAvailabilityDto } from './create-fuel-availability.dto';

export class UpdateFuelAvailabilityDto extends PartialType(
  CreateFuelAvailabilityDto,
) {}
