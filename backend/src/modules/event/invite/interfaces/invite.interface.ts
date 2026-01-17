export interface IInvite {
  id: string;
  eventId: string;
  role: InviteRole;
  areaId?: string | null;

  code: string; // 8 символов
  expiresAt?: Date;
  usedAt?: Date;
  invitedBy?: string; // кто пригласил
}

export enum InviteRole {
  JURY = 'jury',
  MODERATOR = 'moderator',
}
