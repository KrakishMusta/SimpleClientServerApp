import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AreaService } from './area.service';
import { Area } from './entities/area.entity';

@ApiTags('areas')
@Controller('areas')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}
  @Get()
  @ApiOperation({ summary: 'Get area dictionary' })
  findAll(): Promise<Area[]> {
    return this.areaService.findAll();
  }
}
