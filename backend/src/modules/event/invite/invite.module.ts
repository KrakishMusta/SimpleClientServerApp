import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { InviteService } from './invite.service';
import { GenerateInviteCodeUtil } from 'src/common/utils/generate-invite-code.util';
import { EventUserService } from '../event-user/event-user.service';
import { EventUser } from '../event-user/entities/event-user.entity';
import { Invite } from './entities/invite.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([EventUser, Invite]), // 🔹 добавляем Invite
  ],
  providers: [EventUserService, InviteService, GenerateInviteCodeUtil],
  exports: [InviteService], // если будем использовать InviteService в других модулях
})
export class InviteModule {}
