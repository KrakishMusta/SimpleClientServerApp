import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { City } from '../entities/city.entity';
import { CityService } from '../services/city.service';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Get()
  @ApiOperation({ summary: 'Get city dictionary' })
  findAll(): Promise<City[]> {
    return this.cityService.findAll();
  }
}
