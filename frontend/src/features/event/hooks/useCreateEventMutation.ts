import { useMutation } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import type { IEvent } from '../types/event.types';
import { ICreateEventRequest } from '../dto/create-event-request.dto';

export function useCreateEvent() {
	return useMutation<ICreateEventRequest, Error, IEvent>({
		mutationKey: ['create event'],
		mutationFn: (dto) => eventService.createEvent(dto),
	});
}
