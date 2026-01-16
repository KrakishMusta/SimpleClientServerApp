import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventModel } from './entities/event.entity';
import { EventService } from './event.service';

@Module({
  imports: [SequelizeModule.forFeature([EventModel])],
  providers: [EventService],
  exports: [EventService, SequelizeModule.forFeature([EventModel])],
})
export class EventModule {}
