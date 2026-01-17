import { IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { InviteRole } from '../interfaces/invite.interface';

export class CreateInviteDto {
  @IsUUID()
  eventId: string;

  @IsEnum(InviteRole)
  role: InviteRole;

  @IsOptional()
  @IsUUID()
  areaId?: string | null;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
