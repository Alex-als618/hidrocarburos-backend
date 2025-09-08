import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFuelTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del tipo de combustible es obligatorio' })
  @MaxLength(50, { message: 'El nombre no debe tener más de 50 caracteres' })
  fuelName: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(255, {
    message: 'La descripción no debe tener más de 255 caracteres',
  })
  description: string;
}
