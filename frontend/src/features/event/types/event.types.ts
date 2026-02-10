export interface IEvent {
	id?: string;
	title: string;
	areaId: string;
	area?: string;
	startDate: string;
	endDate: string;
	durationDays: number;
	durationMins: number;
	cityId: string;
	city?: string;
	activities?: IActivityRecord[] | null;
	winner?: string | null;
}

export interface IActivityRecord {
	id?: string;
	title: string;
	start: string;
	dayIndex: number;
	date: string;
	jury: string[] | null;
}
