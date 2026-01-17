export interface IEvent {
  id: string;
  title: string;
  areaId: string;
  startDate: Date;
  duration: number;
  cityId: string;
  activities?: IActivityRecord[] | null;
  winner?: string | null;
}

export interface IActivityRecord {
  title: string;
  start: string;
  jury: string[] | null;
}
