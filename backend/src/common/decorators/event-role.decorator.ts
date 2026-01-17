import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enums/enums';

export const EVENT_ROLES_KEY = 'eventRoles';
export const EventRole = (...roles: UserRole[]) =>
  SetMetadata(EVENT_ROLES_KEY, roles);
