import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventModel } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActivityService } from '../activity/activity.service';
import { City } from 'src/modules/city/entities/city.entity';
import { Area } from 'src/modules/area/entities/area.entity';
import { ActivityResponseDto } from '../activity/dto/activity-response.dto';
import { EventDetailsDto } from './dto/event-details.dto';
// import { CityService } from 'src/modules/city/services/city.service';
// import { AreaService } from 'src/modules/area/area.service';
import { EventUserService } from '../event-user/event-user.service';
import { UserRole } from 'src/enums/enums';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventModel)
    private eventModel: typeof EventModel,

    private activityService: ActivityService,

    private eventUserService: EventUserService,
    // private cityService: CityService,
    // private areaService: AreaService,
  ) {}

  async create(dto: CreateEventDto, userId: string): Promise<EventModel> {
    console.log(dto);

    const { activities, ...eventDto } = dto;

    const event = await this.eventModel.create({
      ...eventDto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      winner: null,
      creatorId: userId,
    });

    await this.eventUserService.assignUserToEvent({
      eventId: event.id,
      userId,
      role: UserRole.ORGANIZER, // или MODERATOR
    });

    if (activities?.length) {
      await this.activityService.createMany(event.id, activities);
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

  async update(id: string, dto: UpdateEventDto): Promise<EventDetailsDto> {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await event.update({
      title: dto.title,
      cityId: dto.city,
      winner: dto.winner,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    });

    if (dto.activitiesDiff) {
      const { added, updated, removed } = dto.activitiesDiff;

      if (removed?.length) {
        await this.activityService.removeMany(removed);
      }

      if (updated?.length) {
        await this.activityService.updateMany(updated);
      }

      if (added?.length) {
        await this.activityService.createMany(event.id, added);
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
  async findOne(id: string, userId?: string): Promise<EventDetailsDto> {
    const event = await this.eventModel.findByPk(id, {
      include: [
        {
          model: City,
          attributes: ['id', 'name'],
        },
        {
          model: Area,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const activities = await this.activityService.getByEvent(id);

    console.log(`organizer params`, !!userId, event.creatorId === userId);

    const isOrganizer = !!userId && event.creatorId === userId;

    return {
      id: event.id,
      title: event.title,

      cityId: event.cityId,
      cityName: event.city?.name ?? 'Нет данных',

      areaId: event.areaId,
      areaName: event.area?.name ?? 'Нет данных',

      startDate: event.startDate,
      endDate: event.endDate,
      durationDays: event.durationDays,
      durationMins: event.durationMins,
      winner: event.winner,

      activities: activities,
      activitiesByDay: this.groupActivitiesByDay(activities),

      creatorId: event.creatorId,

      isOrganizer,
    };
  }

  private groupActivitiesByDay(
    activities: ActivityResponseDto[],
  ): Record<string, ActivityResponseDto[]> {
    return activities.reduce<Record<string, ActivityResponseDto[]>>(
      (acc, activity) => {
        const dayKey = activity.date.toISOString().split('T')[0];

        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }

        acc[dayKey].push(activity); // ← ничего не режем

        return acc;
      },
      {},
    );
  }
}
