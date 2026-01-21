import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { CreateActivityDto } from '../../activity/dto/create-activity.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  activities?: CreateActivityDto[] | null;

  @IsOptional()
  @IsString()
  winner?: string | null;
}
