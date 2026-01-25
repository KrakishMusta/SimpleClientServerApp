import { IEvent } from '@/features/event/types/event.types';

export interface IGetEventsList extends Omit<IEvent, 'area' | 'city'> {
	area: {
		id: string;
		name: string;
	} | null;

	city: {
		id: string;
		name: string;
	} | null;
}
