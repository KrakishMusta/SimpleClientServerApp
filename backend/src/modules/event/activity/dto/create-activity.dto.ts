import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 'Лекция по ТЗ' })
  @IsString()
  title: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  start: string; // HH:mm

  @ApiProperty({ example: 0, description: 'Индекс дня (с 0)' })
  @IsNumber()
  dayIndex: number;

  @ApiProperty({
    example: '2026-01-22',
    description: 'Дата дня активности',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [String], required: false, nullable: true })
  @IsArray()
  @IsString({ each: true })
  jury: string[] | null;
}
