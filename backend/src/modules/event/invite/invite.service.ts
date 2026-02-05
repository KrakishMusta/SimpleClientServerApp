import {
  ConflictException,
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
  async createInvite(dto: CreateInviteDto) {
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
      expiresAt: expiresAtDate,
    });
  }

  async acceptInvite(code: string, userId: string) {
    const invite = await this.inviteModel.findOne({ where: { code } });
    if (!invite) throw new NotFoundException('Invite not found');

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new ForbiddenException('Invite expired');
    }

    try {
      await this.eventUserService.assignUserToEvent({
        eventId: invite.eventId,
        userId,
        role: invite.role === 'jury' ? UserRole.JURY : UserRole.MODERATOR,
      });
      invite.usesCount += 1;
      await invite.save();
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ForbiddenException('User already in event');
      }
      throw e;
    }

    if (invite.maxUses !== null && invite.usesCount >= invite.maxUses) {
      throw new ForbiddenException('Invite usage limit reached');
    }

    await this.eventUserService.assignUserToEvent({
      eventId: invite.eventId,
      userId,
      role: invite.role === 'jury' ? UserRole.JURY : UserRole.MODERATOR,
    });

    invite.usesCount += 1;
    await invite.save();

    return { success: true };
  }
}
