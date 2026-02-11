import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { ActivityJury } from './entities/activity-jury.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity)
    private readonly activityModel: typeof Activity,

    @InjectModel(ActivityJury)
    private readonly activityJuryModel: typeof ActivityJury,
  ) {}

  private parseTime(time: string): Date {
    // ожидаем "HH:mm"
    const [hours, minutes] = time.split(':').map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date;
  }
  // Создание одной активности
  async create(eventId: string, dto: CreateActivityDto): Promise<Activity> {
    const baseDate = new Date(dto.date);

    const [hours, minutes] = dto.start.split(':').map(Number);
    baseDate.setHours(hours, minutes, 0, 0);

    const activity = await this.activityModel.create({
      eventId,
      title: dto.title,
      start: dto.start,
      dayIndex: dto.dayIndex,
      date: baseDate,
    });

    if (dto.jury?.length) {
      await this.activityJuryModel.bulkCreate(
        dto.jury.map((eventUserId) => ({
          activityId: activity.id,
          eventUserId,
        })),
      );
    }

    return activity;
  }

  // Создание списка активностей (из IEvent.activities)
  async createMany(eventId: string, activities: CreateActivityDto[]) {
    const records = activities.map((a) => ({
      ...a,
      eventId,
      date: new Date(a.date), // <-- обязательно конвертируем в Date
    }));

    return this.activityModel.bulkCreate(records);
  }

  async removeMany(ids: string[]) {
    return this.activityModel.destroy({
      where: { id: ids },
    });
  }

  async updateMany(activities: UpdateActivityDto[]) {
    for (const activity of activities) {
      const { id, date, ...rest } = activity;

      await this.activityModel.update(
        {
          ...rest,
          date: date ? new Date(date) : undefined,
        },
        {
          where: { id },
        },
      );
    }
  }

  // Получить активности события
  async getByEvent(eventId: string): Promise<ActivityResponseDto[]> {
    const activities = await this.activityModel.findAll({
      where: { eventId },
      include: [
        {
          model: ActivityJury,
          attributes: ['eventUserId'],
        },
      ],
      order: [
        ['dayIndex', 'ASC'],
        ['start', 'ASC'],
      ],
    });

    return activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      dayIndex: activity.dayIndex,
      start: activity.start,
      date: activity.date,
      jury: activity.jury?.map((j) => j.eventUserId) ?? [],
    }));
  }

  // Удалить все активности события (например, при редактировании)
  async removeByEvent(eventId: string) {
    const activities = await this.activityModel.findAll({
      where: { eventId },
    });

    const activityIds = activities.map((a) => a.id);

    await this.activityJuryModel.destroy({
      where: { activityId: activityIds },
    });

    await this.activityModel.destroy({
      where: { eventId },
    });
  }

  //   async clearByEvent(eventId: string) {
  //     const activities = await this.activityModel.findAll({
  //       where: { eventId },
  //     });

  //     for (const activity of activities) {
  //       await activity.destroy();
  //     }
  //   }

  async replaceByEvent(eventId: string, activities: CreateActivityDto[]) {
    await this.removeByEvent(eventId);

    for (const activity of activities) {
      const baseDate = new Date(activity.date);

      const [hours, minutes] = activity.start.split(':').map(Number);
      baseDate.setHours(hours, minutes, 0, 0);

      const created = await this.activityModel.create({
        eventId,
        title: activity.title,
        start: activity.start,
        dayIndex: activity.dayIndex,
        date: baseDate,
      });

      if (activity.jury?.length) {
        await this.activityJuryModel.bulkCreate(
          activity.jury.map((eventUserId) => ({
            activityId: created.id,
            eventUserId,
          })),
        );
      }
    }
  }
}
