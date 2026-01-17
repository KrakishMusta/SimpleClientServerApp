import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventUser } from './entities/event-user.entity';
import { EventUserService } from './event-user.service';

@Module({
  imports: [SequelizeModule.forFeature([EventUser])],
  providers: [EventUserService],
  exports: [EventUserService],
})
export class EventUserModule {}
