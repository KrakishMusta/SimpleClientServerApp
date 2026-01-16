import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ActivityRecordDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  start: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  jury: string[];
}

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

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsString()
  cityId: string;

  @ApiProperty({ type: [ActivityRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityRecordDto)
  activities: ActivityRecordDto[];

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  winner?: string | null;
}
