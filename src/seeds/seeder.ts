//import { AppDataSource } from '../data-source';
//import { seedRoles } from '../seeds/role.seeder';
// src/seeders/main-seeder.ts
import { seedRoles } from './roles.seeder';
import { seedFuelTypes } from './fuel-types.seeder';
import { seedFuelStations } from './fuel-stations.seeder';
import { seedUsers } from './users.seeder';
import { seedFuelAvailability } from './fuel-availabilities.seeder';
import { seedUserStationNotifications } from './user-station-notifications.seeder';
import { seedStationImages } from './station-images.seeder';

const runSeeders = async () => {
  await seedRoles();
  await seedFuelTypes();
  await seedFuelStations();
  await seedUsers();
  await seedFuelAvailability();
  await seedUserStationNotifications();
  await seedStationImages();

  console.log('✅ Todos los seeders ejecutados correctamente');
};

runSeeders();