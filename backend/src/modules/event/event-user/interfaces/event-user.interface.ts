import { UserRole } from 'src/enums/enums';
export interface IEventUser {
  id: string;
  eventId: string;
  userId: string;
  role: UserRole;

  invitedBy?: string; // organizerId
  createdAt: Date;
}
