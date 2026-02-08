import { IEvent } from '../types/event.types';
import { ActivityResponseDto } from './activity-response.dto';

export interface EventDetailsDto extends IEvent {
	cityName: string;
	areaName: string;
	activitiesByDay: Record<string, ActivityResponseDto[]>;
	creatorId: string;
	isOrganizer: boolean;
}
