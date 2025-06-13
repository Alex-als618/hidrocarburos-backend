import { DataSource } from 'typeorm';
import { FuelAvailability } from '../fuel-availabilities/entities/fuel-availability.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';
import { FuelType } from '../fuel-types/entities/fuel-type.entity';

export const seedFuelAvailability = async (dataSource: DataSource) => {
  const fuelAvailabilityRepository = dataSource.getRepository(FuelAvailability);
  const fuelStationsRepository = dataSource.getRepository(FuelStation);
  const fuelTypeRepository = dataSource.getRepository(FuelType);

  const fuelStation1 = await fuelStationsRepository.findOne({
    where: { name: 'Estación Ejemplo' },
  });
  const fuelStation2 = await fuelStationsRepository.findOne({
    where: { name: 'Estación Central' },
  });

  const fuelTypeGasolina = await fuelTypeRepository.findOne({
    where: { fuelName: 'Gasolina Regular' },
  });
  const fuelTypeDiesel = await fuelTypeRepository.findOne({
    where: { fuelName: 'Diésel' },
  });

  if (!fuelStation1 || !fuelStation2 || !fuelTypeGasolina || !fuelTypeDiesel) {
    throw new Error(
      '❌ No se encontraron todas las estaciones o tipos de combustible necesarios',
    );
  }

  const fuelAvailabilities = [
    {
      availableQuantity: 100,
      fuelStation: fuelStation1,
      fuelType: fuelTypeGasolina,
    },
    {
      availableQuantity: 50,
      fuelStation: fuelStation2,
      fuelType: fuelTypeDiesel,
    },
  ];

  await fuelAvailabilityRepository.save(fuelAvailabilities);
  console.log('fuel-availabilities guardado con éxito');
};
