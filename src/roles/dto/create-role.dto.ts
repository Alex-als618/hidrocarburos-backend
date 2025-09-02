import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleEnum,
    description:
      'Nombre del rol. Debe ser uno de los valores definidos en RoleEnum',
    example: 'ADMIN',
  })
  @IsEnum(RoleEnum, {
    message: 'roleName debe ser un valor válido de RoleEnum',
  })
  @IsNotEmpty({ message: 'roleName no puede estar vacío' })
  @Matches(/\S/, { message: 'roleName no puede contener solo espacios' })
  @MaxLength(50, { message: 'roleName no debe exceder 50 caracteres' })
  roleName: RoleEnum;

  @ApiPropertyOptional({
    description: 'Descripción opcional del rol',
    example: 'Rol con acceso completo al sistema',
  })
  @IsString({ message: 'description debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(255, { message: 'description no debe exceder 255 caracteres' })
  description?: string;
}
