import { useQuery } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import { IEvent } from '../types/event.types';

export function useGetEvents() {
    return useQuery<IEvent[]>({
        queryKey: ['create event'],

        queryFn: async () => {
            return await eventService.createEvent();
        },
    });
}
