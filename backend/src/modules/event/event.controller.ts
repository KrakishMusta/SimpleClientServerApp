import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventModel } from './entities/event.entity';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 🔹 CREATE
  @Post()
  @ApiOperation({ summary: 'Create event' })
  create(@Body() dto: CreateEventDto): Promise<EventModel> {
    return this.eventService.create(dto);
  }

  // 🔹 READ ALL
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  findAll(): Promise<EventModel[]> {
    return this.eventService.findAll();
  }

  // 🔹 READ ONE
  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Promise<EventModel> {
    return this.eventService.findOne(id);
  }

  // 🔹 UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventModel> {
    return this.eventService.update(id, dto);
  }

  // 🔹 DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}
