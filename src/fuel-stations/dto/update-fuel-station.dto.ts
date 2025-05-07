import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelStationDto } from './create-fuel-station.dto';

export class UpdateFuelStationDto extends PartialType(CreateFuelStationDto) {}
