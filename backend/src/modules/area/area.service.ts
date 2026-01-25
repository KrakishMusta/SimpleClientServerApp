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
      // findOrCreate работает как раньше, UUID сгенерируется автоматически
      await this.areaModel.findOrCreate({
        where: { name },
        defaults: { name }, // defaults нужен для корректного создания новой записи
      });
    }
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel.findAll({
      order: [['name', 'ASC']],
    });
  }
}
