import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Area } from 'src/modules/area/entities/area.entity';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area)
    private readonly areaModel: typeof Area,
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
      await this.areaModel.findOrCreate({
        where: { name },
      });
    }
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel.findAll({
      order: [['name', 'ASC']],
    });
  }
}
