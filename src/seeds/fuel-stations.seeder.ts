// src/seeders/fuel-stations.seeder.ts
import { AppDataSource } from '../data-source';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedFuelStations = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(FuelStation);

  const stations = [
    { name: 'Estación 1', location: 'Calle Ficticia 123' },
    { name: 'Estación 2', location: 'Avenida Real 456' },
    { name: 'Estación 3', location: 'Ruta 10' },
  ];

  for (const station of stations) {
    const exists = await repo.findOneBy({ name: station.name });
    if (!exists) {
      const fuelStation = repo.create({ name: station.name, location: station.location });
      await repo.save(fuelStation);
    }
  }

  console.log('✅ Fuel Stations seeded');
  await dataSource.destroy();
};