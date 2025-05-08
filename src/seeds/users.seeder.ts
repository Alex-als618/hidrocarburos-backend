// src/seeders/users.seeder.ts
import { AppDataSource } from '../data-source';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

export const seedUsers = async () => {
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
};