import { IsString, IsNumber, IsInt, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFuelStationDto {
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  stationName: string;

  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsInt()
  @Min(1)
  idMunicipality: number;
}
