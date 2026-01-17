import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  start: string; // HH:mm

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  jury: string[];
}
