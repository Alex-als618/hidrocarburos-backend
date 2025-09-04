import { IsNumber, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFuelAvailabilityDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  availableQuantity: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  idFuelStation: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  idFuelType: number;
}
