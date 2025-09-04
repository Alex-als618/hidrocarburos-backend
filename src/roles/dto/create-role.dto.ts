import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';

export class CreateRoleDto {
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  roleName: RoleEnum;

  @IsString()
  @IsOptional()
  description: string;
}
