import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFuelTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del tipo de combustible es obligatorio' })
  @MaxLength(100, { message: 'El nombre no debe tener más de 100 caracteres' })
  name: string;
}
