// src/seeders/fuel-types.seeder.ts
import { AppDataSource } from '../data-source';
import { FuelType } from '../fuel-types/entities/fuel-type.entity';

export const seedFuelTypes = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(FuelType);

  const fuelTypes = ['Gasolina', 'Diésel', 'Gas Natural'];

  for (const fuelTypeName of fuelTypes) {
    const exists = await repo.findOneBy({ fuelName: fuelTypeName });
    if (!exists) {
      const fuelType = repo.create({ fuelName: fuelTypeName });
      await repo.save(fuelType);
    }
  }

  console.log('✅ Fuel Types seeded');
  await dataSource.destroy();
};