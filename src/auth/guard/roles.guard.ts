import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';

/**
 * Guard para controlar acceso basado en roles definidos en el decorador @Roles.
 * Permite acceso solo a usuarios con roles requeridos o admin.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene roles requeridos del decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles requeridos, se permite el acceso
    if (!requiredRoles) return true;

    // Extrae el usuario del request
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) return false;

    // Los administradores tienen acceso completo
    if (user.role === RoleEnum.ADMIN) return true;

    // Verifica si el rol del usuario está autorizado
    return requiredRoles.includes(user.role);
  }
}
