// import { AppDataSource } from '../data-source';
// import { seedRoles } from './roles.seeder';
// import { seedUsers } from './users.seeder';
// import { seedFuelStations } from './fuel-stations.seeder';
// import { seedFuelTypes } from './fuel-types.seeder';
// import { seedFuelAvailability } from './fuel-availabilities.seeder';
// import { seedUserStationNotifications } from './user-station-notifications.seeder';
// import { seedStationImages } from './station-images.seeder';

// const runSeed = async () => {

//   await AppDataSource.initialize();
//   console.log('📦 Base de datos conectada');

//   // Primero sembramos los roles
//   await seedRoles(AppDataSource);

//   await seedFuelStations(AppDataSource);

//   await seedUsers(AppDataSource);

//   await seedFuelTypes(AppDataSource);

//   await seedFuelAvailability(AppDataSource);

//   await seedUserStationNotifications(AppDataSource);

//   await seedStationImages(AppDataSource);

//   console.log('🌱 Seeders terminados');
//   process.exit(0);

// };

// runSeed().catch((err) => {
//   console.error('❌ Error al ejecutar el seed:', err);
//   process.exit(1);
// });

//import { DataSource } from 'typeorm';

/*const runSeeders = async () => {
  await seedRoles();
  await seedFuelTypes();
  await seedFuelStations();
  await seedUsers();
  await seedFuelAvailability();
  await seedUserStationNotifications();
  await seedStationImages();

  console.log('✅ Todos los seeders ejecutados correctamente');
};*/

//runSeeders();
// O como se llame tu conexión
