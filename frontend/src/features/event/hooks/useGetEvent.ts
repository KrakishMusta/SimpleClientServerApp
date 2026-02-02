import { useQuery } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import { EventDetailsDto } from '../dto/get-details-response.dto';

export function useGetEvent(eventId: string) {
	return useQuery<EventDetailsDto>({
		queryKey: ['event', eventId],

		queryFn: async () => {
			return await eventService.getEvent(eventId);
		},

		enabled: !!eventId,
	});
}
