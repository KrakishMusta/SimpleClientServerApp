import { useMutation } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import type { IEvent } from '../types/event.types';
import { ICreateEventRequest } from '../dto/create-event-request.dto';
import { useRouter } from 'vue-router';

export function useCreateEvent() {
	const router = useRouter();

	return useMutation<IEvent, Error, ICreateEventRequest>({
		mutationKey: ['create event'],
		mutationFn: (dto) => eventService.createEvent(dto),

		onSuccess: (event) => {
			// 👉 редирект после успешного создания
			console.log(event);
			router.push(`/events/${event.id}`);
		},
	});
}
