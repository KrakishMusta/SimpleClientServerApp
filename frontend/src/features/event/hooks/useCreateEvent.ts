import { useMutation } from '@tanstack/vue-query';
import { eventService } from '../services/event.service';
import { IEvent } from '../types/event.types';

export function useCreateEvent() {
    return useMutation<IEvent, Error, IEvent>({
        mutationKey: ['create event'],
        mutationFn: (dto) => eventService.createEvent(dto),
    });
}
