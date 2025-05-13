// src/seeders/user-station-notifications.seeder.ts
import { DataSource } from 'typeorm';
import { UserStationNotification } from '../user-station-notifications/entities/user-station-notification.entity';
import { User } from '../users/entities/user.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedUserStationNotifications = async (dataSource: DataSource) => {
  const userStationNotificationRepository = dataSource.getRepository(
    UserStationNotification,
  );
  const userRepository = dataSource.getRepository(User);
  const fuelStationRepository = dataSource.getRepository(FuelStation);

  const user = await userRepository.findOne({
    where: { email: 'user@example.com' },
  });
  const fuelStation = await fuelStationRepository.findOne({
    where: { name: 'Estación Ejemplo' },
  });

  if (!user || !fuelStation) {
    throw new Error('❌ No se encontro el usuario o estación necesaria');
  }

  const notifications = [
    {
      user: user,
      fuelStation: fuelStation,
      subscribed: true,
    },
  ];

  await userStationNotificationRepository.save(notifications);
  console.log('user-station-notifications guardado con éxito');
};
