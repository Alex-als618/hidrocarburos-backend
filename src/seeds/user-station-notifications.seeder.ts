// src/seeders/user-station-notifications.seeder.ts
import { AppDataSource } from '../data-source';
import { UserStationNotification } from '../user-station-notifications/entities/user-station-notification.entity';
import { User } from '../users/entities/user.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedUserStationNotifications = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(UserStationNotification);
  const userRepo = dataSource.getRepository(User);
  const fuelStationRepo = dataSource.getRepository(FuelStation);

  const user1 = await userRepo.findOneBy({ email: 'user1@example.com' });
  const station1 = await fuelStationRepo.findOneBy({ name: 'Estación 1' });

  const notification = { user: user1, fuel_station: station1, active: true };

  const exists = await repo.findOne({
    where: { user: notification.user, fuel_station: notification.fuel_station },
  });
  if (!exists) {
    const userNotification = repo.create(notification);
    await repo.save(userNotification);
  }

  console.log('✅ User Station Notifications seeded');
  await dataSource.destroy();
};