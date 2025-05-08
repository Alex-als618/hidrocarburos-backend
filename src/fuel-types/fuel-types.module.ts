import { Module } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { FuelTypesController } from './fuel-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelType } from './entities/fuel-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelType])],
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
})
export class FuelTypesModule {}
