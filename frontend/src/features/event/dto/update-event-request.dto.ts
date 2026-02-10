import { IActivityRecord } from '../types/event.types';

export interface IUpdateEventRequest {
	title?: string;
	city?: string;
	winner?: string | null;
	startDate?: string;

	activitiesDiff?: {
		added: Omit<IActivityRecord, 'id'>[];
		updated: IActivityRecord[];
		removed: string[];
	};
}
