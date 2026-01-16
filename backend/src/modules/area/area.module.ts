import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Area } from 'src/modules/area/entities/area.entity';
import { AreaService } from './services/area.service';

@Module({
  imports: [SequelizeModule.forFeature([Area])],
  providers: [AreaService],
  exports: [AreaService], // 👈 ВАЖНО
})
export class AreaModule {}
