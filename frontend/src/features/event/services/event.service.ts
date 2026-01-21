import { api } from '@/shared/api/instance.api';
import { IEvent } from '../types/event.types';

class EventService {
    async getEvents(): Promise<IEvent[]> {
        const response = await api.get<IEvent[]>('events/', {
            withCredentials: true,
        });
        return response;
    }
    async createEvent(): Promise<IEvent> {
        const response = await api.post<IEvent>('events/', {
            withCredentials: true,
        });
        return response;
    }
}

export const eventService = new EventService();
