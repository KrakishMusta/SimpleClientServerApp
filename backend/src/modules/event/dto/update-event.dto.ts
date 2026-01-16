import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { IActivityRecord } from '../interfaces/event.interface';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  activities?: IActivityRecord[];

  @IsOptional()
  @IsString()
  winner?: string | null;
}
