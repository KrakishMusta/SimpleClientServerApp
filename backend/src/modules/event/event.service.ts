import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventModel } from '../entities/event.entity';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventModel)
    private eventModel: typeof EventModel,
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

    const updatePayload: Partial<EventModel> = {
      title: dto.title,
      cityId: dto.city,
      winner: dto.winner,
    };

    if (dto.startDate) {
      updatePayload.startDate = new Date(dto.startDate);
    }

    if (dto.activities) {
      updatePayload.activities = dto.activities;
      // 🔥 jury будет ПОЛНОСТЬЮ перезаписан
    }

    await event.update(updatePayload);

    return event;
  }

  // 🔹 GET /event
  async findAll(): Promise<EventModel[]> {
    return this.eventModel.findAll({
      order: [['startDate', 'ASC']],
    });
  }

  // 🔹 GET /event/:id
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
