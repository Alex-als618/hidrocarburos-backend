import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { FuelStation } from '../fuel-stations/entities/fuel-station.entity';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const fuelStationsRepository = dataSource.getRepository(FuelStation);

  const adminRole = await roleRepository.findOne({
    where: { roleName: 'admin' },
  });
  const userRole = await roleRepository.findOne({
    where: { roleName: 'user' },
  });

  const fuelStation1 = await fuelStationsRepository.findOne({
    where: { name: 'Estación Central' },
  });
  const fuelStation2 = await fuelStationsRepository.findOne({
    where: { name: 'Gasolinera El Norte' },
  });

  if (!adminRole || !userRole) {
    console.log(
      'No se encontraron roles. Asegúrate de haber sembrado los roles primero.',
    );
    return;
  }

  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword',
      phone: '1234567890',
      role: adminRole,
      id_fuel_station: fuelStation1,
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'userpassword',
      phone: '0987654321',
      role: userRole,
      id_fuel_station: fuelStation2,
    },
  ];

  await userRepository.save(users);
  console.log('Users guardado con éxito');
};

/*import { AppDataSource } from '../data-source';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';*/

/*export const seedUsers = async () => {
  const dataSource = await AppDataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const adminRole = await roleRepo.findOneBy({ roleName: 'ADMIN' });
  const userRole = await roleRepo.findOneBy({ roleName: 'USER' });

  const users = [
    { username: 'admin', email: 'admin@admin.com', password: 'admin123', role: adminRole },
    { username: 'user1', email: 'user1@example.com', password: 'user123', role: userRole },
    { username: 'user2', email: 'user2@example.com', password: 'user123', role: userRole },
  ];

  for (const userData of users) {
    const exists = await userRepo.findOneBy({ email: userData.email });
    if (!exists) {
      const user = userRepo.create(userData);
      await userRepo.save(user);
    }
  }

  console.log('✅ Users seeded');
  await dataSource.destroy();
};*/
// Asegúrate de que la ruta sea correcta

/*export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const users = [
    { username: 'admin', email: 'admin@example.com' },
    { username: 'user1', email: 'user1@example.com' },
    // más usuarios si es necesario
  ];

  for (const user of users) {
    await userRepository.save(user);
  }

  console.log('Usuarios sembrados con éxito');
};*/
