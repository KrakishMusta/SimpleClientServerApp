import { api } from '@/shared/api/instance.api';
import { ICreateEventRequest } from '../dto/create-event-request.dto';
import { IEvent } from '../types/event.types';
import { IGetEventsList } from '../dto/get-list-events.dto';

class EventService {
	async getEvents(): Promise<IGetEventsList[]> {
		const response = await api.get<IGetEventsList[]>('events/', {
			withCredentials: true,
		});
		return response;
	}
	async createEvent(event: ICreateEventRequest): Promise<IEvent> {
		const response = await api.post<IEvent>('events/', event, {
			withCredentials: true,
		});
		return response;
	}
}

export const eventService = new EventService();
