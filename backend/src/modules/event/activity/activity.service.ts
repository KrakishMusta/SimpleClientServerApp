import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { ActivityJury } from './entities/activity-jury.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

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
    const activity = await this.activityModel.create({
      eventId,
      title: dto.title,
      start: new Date(dto.start),
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
    for (const activity of activities) {
      await this.create(eventId, activity);
    }
  }

  // Получить активности события
  async getByEvent(eventId: string) {
    const activities = await this.activityModel.findAll({
      where: { eventId },
      include: [
        {
          model: ActivityJury,
          attributes: ['userId'],
        },
      ],
      order: [['start', 'ASC']],
    });

    return activities.map((activity) => ({
      title: activity.title,
      start: activity.start.toISOString(),
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
      const created = await this.activityModel.create({
        eventId,
        title: activity.title,
        start: this.parseTime(activity.start),
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
