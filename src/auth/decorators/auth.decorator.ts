import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
}
