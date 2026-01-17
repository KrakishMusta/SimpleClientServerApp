import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { ActivityJury } from './entities/activity-jury.entity';
import { ActivityService } from './activity.service';

@Module({
  imports: [SequelizeModule.forFeature([Activity, ActivityJury])],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
