import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventUserService } from 'src/modules/event/event-user/event-user.service';
import { UserRole } from 'src/enums/enums';
import { EVENT_ROLES_KEY } from '../decorators/event-role.decorator';

@Injectable()
export class EventRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private eventUserService: EventUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.get<UserRole[]>(
      EVENT_ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const eventId = request.params.id || request.body.eventId;
    if (!eventId) throw new ForbiddenException('Event ID is required');

    const hasRole = await this.eventUserService.hasRole(
      eventId,
      user.id,
      requiredRoles,
    );

    if (!hasRole) throw new ForbiddenException('Insufficient role');

    return true;
  }
}
