import { IEvent } from '../interfaces/event.interface';
import { ActivityResponseDto } from '../../activity/dto/activity-response.dto';

export interface EventDetailsDto extends IEvent {
  cityName: string;
  areaName: string;
  activitiesByDay: Record<string, ActivityResponseDto[]>;
  creatorId: string;
  isOrganizer: boolean;
}
