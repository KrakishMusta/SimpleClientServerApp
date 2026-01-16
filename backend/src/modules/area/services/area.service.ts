import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Area } from 'src/modules/area/entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area)
    private readonly directionModel: typeof Area,
  ) {}

  async seed() {
    const areas = [
      'ИТ',
      'Биг Дата',
      'Дизайн',
      'Аналитика',
      'Информационная безопасность',
    ];

    for (const name of areas) {
      await this.directionModel.findOrCreate({
        where: { name },
      });
    }
  }
}
