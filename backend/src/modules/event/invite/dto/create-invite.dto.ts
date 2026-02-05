import {
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
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

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number; // undefined / null → бесконечный инвайт
}
