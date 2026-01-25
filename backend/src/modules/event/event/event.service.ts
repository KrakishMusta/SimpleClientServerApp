import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventModel } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActivityService } from '../activity/activity.service';
import { City } from 'src/modules/city/entities/city.entity';
import { Area } from 'src/modules/area/entities/area.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventModel)
    private eventModel: typeof EventModel,

    private activityService: ActivityService,
  ) {}

  async create(dto: CreateEventDto): Promise<EventModel> {
    console.log(dto);

    const { activities, ...eventDto } = dto;

    const event = await this.eventModel.create({
      ...eventDto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      winner: null,
    });

    if (activities?.length) {
      await this.activityService.createMany(event.id, activities);
    }

    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventModel> {
    const event = await this.eventModel.findByPk(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // обновляем поля события
    await event.update({
      title: dto.title,
      cityId: dto.city,
      winner: dto.winner,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    });

    // activities — отдельно
    if (dto.activities !== undefined) {
      if (dto.activities === null) {
        await this.activityService.removeByEvent(event.id);
      } else {
        await this.activityService.replaceByEvent(event.id, dto.activities);
      }
    }

    return this.findOne(id);
  }

  async findAll(): Promise<EventModel[]> {
    return this.eventModel.findAll({
      include: [
        {
          model: City,
          attributes: ['name'],
        },
        {
          model: Area,
          attributes: ['name'],
        },
      ],
      order: [['startDate', 'ASC']],
    });
  }

  // GET /event/:id
  async findOne(id: string): Promise<EventModel> {
    const event = await this.eventModel.findByPk(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventModel.findByPk(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await event.destroy();
  }
}
