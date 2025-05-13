import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    { roleName: 'admin', description: 'Administrador del sistema' },
    { roleName: 'user', description: 'Usuario estándar' },
  ];

  await roleRepository.save(roles);
  console.log('roles guardado con éxito');
};

// OTRAS FORMA DE HACERLO
/*
import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity'; // Asegúrate de importar la entidad Role

export const seedRoles = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);

  // Creamos los roles utilizando la entidad
  const adminRole = new Role();
  adminRole.name = 'admin';

  const userRole = new Role();
  userRole.name = 'user';

  // Guardamos los roles en la base de datos
  await roleRepository.save([adminRole, userRole]);

  console.log('Roles sembrados con éxito');
};
*/
/*
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
*/
