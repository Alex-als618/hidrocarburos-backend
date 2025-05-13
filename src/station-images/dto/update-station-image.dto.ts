import { PartialType } from '@nestjs/mapped-types';
import { CreateStationImageDto } from './create-station-image.dto';

export class UpdateStationImageDto extends PartialType(CreateStationImageDto) {}
