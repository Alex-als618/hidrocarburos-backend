import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';

/**
 * Decorador para proteger rutas con autenticación y control de roles.
 * Usa AuthGuard('jwt') + RolesGuard y aplica @Roles con los roles requeridos.
 */

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
