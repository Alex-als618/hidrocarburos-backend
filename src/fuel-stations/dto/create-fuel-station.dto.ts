import { IsString, IsNumber, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFuelStationDto {
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  municipality: string;

  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  address: string;

  @IsNumber()
  gpsLatitude: number;

  @IsNumber()
  gpsLongitude: number;
}
