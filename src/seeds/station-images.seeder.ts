// src/seeders/station-images.seeder.ts
import { AppDataSource } from '../data-source';
import { StationImage } from '../station-images/entities/station-image.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedStationImages = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(StationImage);
  const fuelStationRepo = dataSource.getRepository(FuelStation);

  const station1 = await fuelStationRepo.findOneBy({ name: 'Estación 1' });

  const images = [
    { fuel_station: station1, image_url: 'http://example.com/image1.jpg' },
    { fuel_station: station1, image_url: 'http://example.com/image2.jpg' },
  ];

  for (const imageData of images) {
    const exists = await repo.findOne({
      where: { fuelStation: imageData.fuel_station, image_url: imageData.image_url },
    });
    if (!exists) {
      const stationImage = repo.create(imageData);
      await repo.save(stationImage);
    }
  }

  console.log('✅ Station Images seeded');
  await dataSource.destroy();
};