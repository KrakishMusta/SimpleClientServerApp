import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { CityService } from './services/city.service';

@Module({
  imports: [SequelizeModule.forFeature([City])],
  providers: [CityService],
  exports: [CityService, SequelizeModule.forFeature([City])],
})
export class CityModule {}
