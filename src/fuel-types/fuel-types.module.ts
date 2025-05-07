import { Module } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { FuelTypesController } from './fuel-types.controller';

@Module({
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
})
export class FuelTypesModule {}
