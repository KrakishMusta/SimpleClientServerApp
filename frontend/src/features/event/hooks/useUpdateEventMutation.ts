import { ref } from 'vue';
import { eventService } from '../services/event.service';
import type { IUpdateEventRequest } from '../dto/update-event-request.dto';
import type { EventDetailsDto } from '../dto/get-details-response.dto';

export function useUpdateEventMutation() {
	const isLoading = ref(false);
	const error = ref<Error | null>(null);
	const data = ref<EventDetailsDto | null>(null);

	const mutate = async (id: string, payload: IUpdateEventRequest) => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await eventService.updateEvent(id, payload);
			data.value = response;
			return response;
		} catch (err) {
			error.value = err as Error;
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	return {
		mutate,
		data,
		isLoading,
		error,
	};
}
