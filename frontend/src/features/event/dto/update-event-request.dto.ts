import { IActivityRecord } from '../types/event.types';

export interface IUpdateEventRequest {
	title?: string;
	city?: string;
	area?: string;
	winner?: string | null;
	startDate?: string;
	endDate?: string;

	activitiesDiff?: {
		added: Omit<IActivityRecord, 'id'>[];
		updated: IActivityRecord[];
		removed: string[];
	};
}
