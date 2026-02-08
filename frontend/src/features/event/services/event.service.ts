import { api } from '@/shared/api/instance.api';
import { ICreateEventRequest } from '../dto/create-event-request.dto';
import { IEvent } from '../types/event.types';
import { IGetEventsList } from '../dto/get-list-events.dto';
import { EventDetailsDto } from '../dto/get-details-response.dto';
import { error } from 'console';
import { IUpdateEventRequest } from '../dto/update-event-request.dto';

class EventService {
	async getEvent(id: string): Promise<EventDetailsDto> {
		const response = await api.get<EventDetailsDto>(`events/${id}`, {
			withCredentials: true,
		});
		return response;
	}
	async getEvents(): Promise<IGetEventsList[]> {
		const response = await api.get<IGetEventsList[]>('events/', {
			withCredentials: true,
		});
		return response;
	}
	async createEvent(event: ICreateEventRequest): Promise<IEvent> {
		try {
			const response = await api.post<IEvent>('events/', event, {
				withCredentials: true,
			});
			console.log(response);
			return response;
		} catch (error) {
			console.log(error);
		}
	}
	async updateEvent(id: string, event: IUpdateEventRequest): Promise<EventDetailsDto> {
		const response = await api.patch<EventDetailsDto>(`events/${id}`, event, {
			withCredentials: true,
		});
		return response;
	}
}

export const eventService = new EventService();
