import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/role.enum';

/** Decorador que define los roles permitidos usando metadatos. */

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
