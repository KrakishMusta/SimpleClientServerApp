import { useQuery } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import { IEvent } from '../types/event.types';
import { IGetEventsList } from '../dto/get-list-events.dto';

export function useGetEvents() {
	return useQuery<IGetEventsList[]>({
		queryKey: ['get events'],

		queryFn: async () => {
			return await eventService.getEvents();
		},
	});
}
