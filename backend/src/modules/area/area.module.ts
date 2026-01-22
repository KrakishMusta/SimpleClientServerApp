import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Area } from 'src/modules/area/entities/area.entity';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';

@Module({
  imports: [SequelizeModule.forFeature([Area])],
  providers: [AreaService],
  controllers: [AreaController],
  exports: [AreaService], // 👈 ВАЖНО
})
export class AreaModule {}
