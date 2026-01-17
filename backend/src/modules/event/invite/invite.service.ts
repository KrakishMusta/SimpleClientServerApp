import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UserRole } from 'src/enums/enums';
import { Invite } from './entities/invite.entity';
import { GenerateInviteCodeUtil } from 'src/common/utils/generate-invite-code.util';
import { EventUserService } from '../event-user/event-user.service';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Invite)
    private inviteModel: typeof Invite,

    private eventUserService: EventUserService,

    private readonly generateInviteCode: GenerateInviteCodeUtil,
  ) {}
  async createInvite(dto: CreateInviteDto, invitedBy: string) {
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = this.generateInviteCode.generateInviteCode(); // используем утилиту
      const existing = await this.inviteModel.findOne({ where: { code } });
      isUnique = !existing;
    }

    // Преобразуем expiresAt в Date | null
    const expiresAtDate: Date | null = dto.expiresAt
      ? new Date(dto.expiresAt)
      : null;

    return this.inviteModel.create({
      ...dto,
      code,
      invitedBy,
      expiresAt: expiresAtDate,
    });
  }

  async acceptInvite(code: string, userId: string) {
    const invite = await this.inviteModel.findOne({ where: { code } });
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.usedAt) throw new ForbiddenException('Invite already used');
    if (invite.expiresAt && invite.expiresAt < new Date())
      throw new ForbiddenException('Invite expired');

    // добавляем пользователя в событие
    await this.eventUserService.assignUserToEvent({
      eventId: invite.eventId,
      userId,
      role: invite.role === 'jury' ? UserRole.JURY : UserRole.MODERATOR,
      invitedBy: invite.invitedBy,
    });

    // помечаем приглашение как использованное
    invite.usedAt = new Date();
    await invite.save();

    return { success: true };
  }
}
