import { DataSource } from 'typeorm';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedFuelStations = async (dataSource: DataSource) => {
  const fuelStationsRepository = dataSource.getRepository(FuelStation);

  const fuelStations = [
    {
      name: 'Estación Ejemplo',
      municipality: 'Municipio X',
      address: 'Dirección 123',
      gpsLatitude: 15.123456,
      gpsLongitude: -90.123456,
    },
    {
      name: 'Estación Central',
      municipality: 'Ciudad Capital',
      address: 'Avenida Principal 101',
      gpsLatitude: 14.634915,
      gpsLongitude: -90.506882,
    },
    {
      name: 'Gasolinera El Norte',
      municipality: 'San Juan',
      address: 'Carretera al Norte Km 18',
      gpsLatitude: 15.78225,
      gpsLongitude: -91.145678,
    },
  ];

  await fuelStationsRepository.save(fuelStations);
  console.log('fuel-stations guardado con éxito');
};
