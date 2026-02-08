import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import { EventDetailsDto } from '../dto/get-details-response.dto';
import { useUserInfo } from '@/entities/user/model/useUserInfo';

export function useGetEvent(eventId: string) {
	const { isAuthReady } = useUserInfo();

	const isQueryEnabled = computed(() => !!eventId && isAuthReady.value);

	return useQuery<EventDetailsDto>({
		queryKey: ['event', eventId],
		queryFn: async () => {
			console.log(`GET EVENT`);
			return await eventService.getEvent(eventId);
		},
		enabled: isQueryEnabled, // теперь реактивно
	});
}
