import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import countries from '../data/countries.json';
import { Country } from '../entities/county.entity';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);

  constructor(
    @InjectModel(Country)
    private readonly countryModel: typeof Country,
  ) {}

  async seed() {
    if (!countries) return;
    for (const country of countries) {
      await this.countryModel.findOrCreate({
        where: { name: country.name },
        defaults: {
          name: country.name,
          eNname: country.eNname,
          code: country.code,
          countryCode: Number(country.countryCode),
        },
      });
    }

    this.logger.log(`Country dictionary seeded (${countries.length})`);
  }
}
