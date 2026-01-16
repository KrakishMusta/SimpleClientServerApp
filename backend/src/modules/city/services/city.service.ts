import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import cities from '../data/cities.json';
import { City } from '../entities/city.entity';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(
    @InjectModel(City)
    private readonly cityModel: typeof City,
  ) {}

  async seed() {
    if (!cities) return;
    for (const city of cities) {
      await this.cityModel.findOrCreate({
        where: { name: city.name },
        defaults: {
          name: city.name,
          emblem: city.emblem ?? null,
        },
      });
    }

    this.logger.log(`Country dictionary seeded (${cities.length})`);
  }
}
