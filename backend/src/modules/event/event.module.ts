import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityModule } from './activity/activity.module';
import { EventUserModule } from './event-user/event-user.module';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { InviteModule } from './invite/invite.module';
import { EventModel } from './event/entities/event.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([EventModel]),
    ActivityModule,
    EventUserModule,
    InviteModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
