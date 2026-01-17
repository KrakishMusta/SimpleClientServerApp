import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventModel } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventModel)
    private eventModel: typeof EventModel,

    private activityService: ActivityService,
  ) {}

  async create(dto: CreateEventDto): Promise<EventModel> {
    const event = await this.eventModel.create({
      ...dto,
      startDate: new Date(dto.startDate), // важно
      winner: null,
    });

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

  // GET /event
  async findAll(): Promise<EventModel[]> {
    return this.eventModel.findAll({
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
