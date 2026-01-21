import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { CityService } from './services/city.service';
import { CityController } from './controllers/city.controller';

@Module({
  imports: [SequelizeModule.forFeature([City])],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService, SequelizeModule.forFeature([City])],
})
export class CityModule {}
