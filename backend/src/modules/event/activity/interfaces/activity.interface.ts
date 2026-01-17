import { IActivityJury } from './activity-jury.interface';

export interface IActivity {
  id: string;
  eventId: string;
  title: string;
  start: Date;
  jury?: IActivityJury[];
}
