import { IActivityRecord } from '../types/event.types';

export interface ICreateEventRequest {
	title: string;

	areaId: string;
	cityId: string;

	startDate: string; // ISO
	endDate: string; // ISO

	durationDays: number;
	durationMins: number;

	activities?: IActivityRecord[] | null;
}
