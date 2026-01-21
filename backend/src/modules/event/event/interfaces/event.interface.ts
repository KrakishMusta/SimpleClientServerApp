export interface IEvent {
  id: string;
  title: string;
  areaId: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  durationMins: number;
  cityId: string;
  activities?: IActivityRecord[] | null;
  winner?: string | null;
}

export interface IActivityRecord {
  title: string;
  start: string;
  jury: string[] | null;
}
