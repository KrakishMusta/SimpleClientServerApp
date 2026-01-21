import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateActivityDto } from '../../activity/dto/create-activity.dto';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  areaId: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsNumber()
  durationDays: number;

  @ApiProperty()
  @IsNumber()
  durationMins: number;

  @ApiProperty()
  @IsString()
  cityId: string;

  @ValidateIf((_, value) => value !== null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityDto)
  activities?: CreateActivityDto[] | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  winner?: string | null;
}
