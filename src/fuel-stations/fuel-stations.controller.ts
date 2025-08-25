import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FuelStationsService } from './fuel-stations.service';
import { CreateFuelStationDto } from './dto/create-fuel-station.dto';
import { UpdateFuelStationDto } from './dto/update-fuel-station.dto';

@Controller('fuel-stations')
export class FuelStationsController {
  constructor(private readonly fuelStationsService: FuelStationsService) {}

  @Post()
  create(@Body() createFuelStationDto: CreateFuelStationDto) {
    return this.fuelStationsService.create(createFuelStationDto);
  }

  //  paginación
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return this.fuelStationsService.findAllPaginated(pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelStationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFuelStationDto: UpdateFuelStationDto,
  ) {
    return this.fuelStationsService.update(+id, updateFuelStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelStationsService.remove(+id);
  }
}
