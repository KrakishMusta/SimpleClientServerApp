import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventModel } from './entities/event.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { EventDetailsDto } from './dto/event-details.dto';
import { EventRoleGuard } from 'src/common/guards/event-role.guard';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // CREATE
  @Post()
  @ApiOperation({ summary: 'Create event' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EventRoleGuard) // JwtAuthGuard всегда первым
  create(@Body() dto: CreateEventDto, @Req() req): Promise<EventModel> {
    // теперь req.user точно существует
    return this.eventService.create(dto, req.user.id);
  }

  // READ ALL
  @Get()
  @ApiOperation({ summary: 'Get all events' })
  findAll(): Promise<EventModel[]> {
    return this.eventService.findAll();
  }

  // READ ONE
  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Promise<EventDetailsDto> {
    return this.eventService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiParam({ name: 'id', type: String })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventDetailsDto> {
    return this.eventService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}
