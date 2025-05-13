import { DataSource } from 'typeorm';
import { StationImage } from '../station-images/entities/station-image.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedStationImages = async (dataSource: DataSource) => {
  const stationImageRepository = dataSource.getRepository(StationImage);
  const fuelStationRepository = dataSource.getRepository(FuelStation);

  const fuelStation = await fuelStationRepository.findOne({
    where: { name: 'Estación Central' },
  });

  if (!fuelStation) {
    throw new Error('❌ No se encontro la estación necesaria');
  }

  const stationImages = [
    {
      fuelStation: fuelStation,
      imageUrl:
        'https://media.gettyimages.com/id/860126718/es/foto/color-gasoline-diesel-pumps.jpg?s=612x612&w=gi&k=20&c=3UD2OqKihDCJiDLOou-GAVMh5FWxVgP43__YmG7r1mo=',
    },
    {
      fuelStation: fuelStation,
      imageUrl:
        'https://media.gettyimages.com/id/1400500695/es/foto/mujer-molesta-reabasteciendo-el-tanque-de-gasolina-en-la-bomba-de-combustible.jpg?s=612x612&w=gi&k=20&c=clPLCn568S6FrhyU5Dmid8hpp5ILIYYpEttIJrDn1o8=',
    },
  ];

  await stationImageRepository.save(stationImages);
  console.log('station-images guardado con éxito');
};
