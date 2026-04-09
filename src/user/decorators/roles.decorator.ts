import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../utils/enums'; 

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
