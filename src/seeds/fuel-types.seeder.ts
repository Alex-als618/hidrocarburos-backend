import { DataSource } from 'typeorm';
import { FuelType } from '../fuel-types/entities/fuel-type.entity';

export const seedFuelTypes = async (dataSource: DataSource) => {
  const fuelTypeRepository = dataSource.getRepository(FuelType);

  const fuelTypes = [
    {
      fuelName: 'Gasolina Regular',
      description:
        'Combustible de 87 octanos, comúnmente utilizado en vehículos de uso diario.',
    },
    {
      fuelName: 'Diésel',
      description:
        'Combustible utilizado principalmente en camiones, autobuses y maquinaria pesada.',
    },
    {
      fuelName: 'Gasolina Premium',
      description:
        'Combustible de alto octanaje (92+), ideal para motores de alto rendimiento.',
    },
  ];

  await fuelTypeRepository.save(fuelTypes);
  console.log('fuel-types guardado con éxito');
};
