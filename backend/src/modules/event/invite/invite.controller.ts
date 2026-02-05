import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';

import { AcceptInviteDto } from './dto/accept-invite.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/enums';
import { EventRoleGuard } from 'src/common/guards/event-role.guard';
import { EventRole } from 'src/common/decorators/event-role.decorator';
import type { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EventRoleGuard)
  @EventRole(UserRole.ORGANIZER)
  async create(@Body() dto: CreateInviteDto) {
    return this.inviteService.createInvite(dto);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  async accept(@CurrentUser() user: JwtPayload, @Body() dto: AcceptInviteDto) {
    return this.inviteService.acceptInvite(dto.code, user.sub);
  }
}
