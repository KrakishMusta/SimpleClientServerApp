import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CountryService } from './services/country.service';
import { Country } from './entities/county.entity';

@Module({
  imports: [SequelizeModule.forFeature([Country])],
  providers: [CountryService],
  exports: [CountryService], // 👈 ВАЖНО
})
export class CountryModule {}
