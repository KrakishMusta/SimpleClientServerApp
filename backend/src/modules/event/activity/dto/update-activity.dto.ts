import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  dayIndex?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  start?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  durationMins?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  jury?: string | null;
}
