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
import { FuelAvailabilitiesService } from './fuel-availabilities.service';
import { CreateFuelAvailabilityDto } from './dto/create-fuel-availability.dto';
import { UpdateFuelAvailabilityDto } from './dto/update-fuel-availability.dto';

@Controller('fuel-availabilities')
export class FuelAvailabilitiesController {
  constructor(
    private readonly fuelAvailabilitiesService: FuelAvailabilitiesService,
  ) {}

  @Post()
  create(@Body() createFuelAvailabilityDto: CreateFuelAvailabilityDto) {
    return this.fuelAvailabilitiesService.create(createFuelAvailabilityDto);
  }

  // Paginación
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return this.fuelAvailabilitiesService.findAllPaginated(
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelAvailabilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFuelAvailabilityDto: UpdateFuelAvailabilityDto,
  ) {
    return this.fuelAvailabilitiesService.update(
      +id,
      updateFuelAvailabilityDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelAvailabilitiesService.remove(+id);
  }
}
