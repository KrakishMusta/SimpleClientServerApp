export interface IInvite {
  id: string;
  eventId: string;
  role: 'jury' | 'moderator';
  areaId?: string | null;

  code: string; // 8 символов
  expiresAt?: Date;
  usedAt?: Date;
}
