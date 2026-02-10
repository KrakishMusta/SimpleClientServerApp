import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateActivityDto } from '../../activity/dto/create-activity.dto';
import { UpdateActivityDto } from '../../activity/dto/update-activity.dto';

class ActivitiesDiffDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  added: CreateActivityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateActivityDto)
  updated: UpdateActivityDto[];

  @IsArray()
  @IsString({ each: true })
  removed: string[];
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  winner?: string | null;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ActivitiesDiffDto)
  activitiesDiff?: ActivitiesDiffDto;
}
