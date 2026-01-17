import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventUser } from './entities/event-user.entity';
import { UserRole } from 'src/enums/enums';

@Injectable()
export class EventUserService {
  constructor(
    @InjectModel(EventUser)
    private readonly eventUserModel: typeof EventUser,
  ) {}

  /**
   * Назначить пользователя на событие
   */
  async assignUserToEvent(params: {
    eventId: string;
    userId: string;
    role: UserRole;
    invitedBy?: string;
  }): Promise<EventUser> {
    const { eventId, userId, role, invitedBy } = params;

    // проверяем, есть ли уже запись
    const existing = await this.eventUserModel.findOne({
      where: { eventId, userId },
    });

    if (existing) {
      throw new ConflictException(
        `User ${userId} already assigned to event ${eventId}`,
      );
    }

    return this.eventUserModel.create({
      eventId,
      userId,
      role,
      invitedBy: invitedBy || null,
    });
  }

  /**
   * Проверить, имеет ли пользователь роль в событии
   */
  async hasRole(
    eventId: string,
    userId: string,
    roles: UserRole | UserRole[],
  ): Promise<boolean> {
    const roleArray = Array.isArray(roles) ? roles : [roles];

    const record = await this.eventUserModel.findOne({
      where: {
        eventId,
        userId,
        role: roleArray,
      },
    });

    return !!record;
  }

  /**
   * Удалить пользователя из события
   */
  async removeUserFromEvent(eventId: string, userId: string): Promise<void> {
    const record = await this.eventUserModel.findOne({
      where: { eventId, userId },
    });

    if (!record) {
      throw new NotFoundException(
        `User ${userId} is not assigned to event ${eventId}`,
      );
    }

    await record.destroy();
  }

  /**
   * Получить всех жюри события
   */
  async getEventJury(eventId: string): Promise<EventUser[]> {
    return this.eventUserModel.findAll({
      where: { eventId, role: UserRole.JURY },
    });
  }

  /**
   * Получить всех модераторов события
   */
  async getEventModerators(eventId: string): Promise<EventUser[]> {
    return this.eventUserModel.findAll({
      where: { eventId, role: UserRole.MODERATOR },
    });
  }
}
