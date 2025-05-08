// src/seeders/roles.seeder.ts
import { AppDataSource } from '../data-source';
import { Role } from '../roles/entities/role.entity';

export const seedRoles = async () => {
  const dataSource = await AppDataSource.initialize();
  const repo = dataSource.getRepository(Role);

  const roles = ['ADMIN', 'USER'];

  for (const roleName of roles) {
    const exists = await repo.findOneBy({ roleName: roleName });
    if (!exists) {
      const role = repo.create({ roleName: roleName });
      await repo.save(role);
    }
  }

  console.log('✅ Roles seeded');
  await dataSource.destroy();
};