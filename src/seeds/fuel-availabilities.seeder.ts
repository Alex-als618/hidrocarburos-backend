// src/seeders/fuel-availability.seeder.ts
import { AppDataSource } from '../data-source';
import { FuelAvailability } from '../fuel-availabilities/entities/fuel-availability.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';
import { FuelType } from '../fuel-types/entities/fuel-type.entity';

export const seedFuelAvailability = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(FuelAvailability);
  const fuelStationRepo = dataSource.getRepository(FuelStation);
  const fuelTypeRepo = dataSource.getRepository(FuelType);

  const station1 = await fuelStationRepo.findOneBy({ name: 'Estación 1' });
  const station2 = await fuelStationRepo.findOneBy({ name: 'Estación 2' });

  const fuelTypeGasolina = await fuelTypeRepo.findOneBy({ fuelName: 'Gasolina' });
  const fuelTypeDiesel = await fuelTypeRepo.findOneBy({ fuelName: 'Diésel' });

  const availability = [
    { fuelStation: station1, fuelType: fuelTypeGasolina, availableQuantity: 100 },
    { fuelStation: station2, fuelType: fuelTypeDiesel, availableQuantity: 50 },
  ];

  for (const availabilityData of availability) {
    const exists = await repo.findOne({
      where: { fuelStation: availabilityData.fuelStation, fuelType: availabilityData.fuelType },
    });
    if (!exists) {
      const fuelAvail = repo.create(availabilityData);
      await repo.save(fuelAvail);
    }
  }

  console.log('✅ Fuel Availability seeded');
  await dataSource.destroy();
};