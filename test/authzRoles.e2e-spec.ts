import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';
import { User } from '../src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

// Pruebas e2e para autorización basada en roles: se verifica acceso permitido/denegado según rol.
describe('Authorization (Admin) (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let adminToken: string;
  let adminUserId: number;
  let userToken: string;
  let normalUserId: number;
  let dataSource: DataSource;
  let adminRole: Role | null;
  let userRole: Role | null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Habilitar validaciones globales
    await app.init();
    dataSource = moduleFixture.get(DataSource);

    userRepo = moduleFixture.get(getRepositoryToken(User));
    roleRepo = moduleFixture.get(getRepositoryToken(Role));

    // Limpiar las tablas para asegurar que no haya datos residuales
    await userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await roleRepo.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    // Crear roles
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      userRole = await queryRunner.manager.findOne(Role, {
        where: { roleName: 'user' },
      });
      if (!userRole) {
        userRole = await queryRunner.manager.save(Role, {
          roleName: 'user',
          description: 'Rol de usuario regular',
        });
      }

      adminRole = await queryRunner.manager.findOne(Role, {
        where: { roleName: 'admin' },
      });
      if (!adminRole) {
        adminRole = await queryRunner.manager.save(Role, {
          roleName: 'admin',
          description: 'Rol de administrador',
        });
      }

      // Confirmar que los roles fueron creados correctamente
      if (!userRole || !adminRole) {
        throw new Error('No se pudieron crear los roles necesarios');
      }

      // Commit de la transacción
      await queryRunner.commitTransaction();
    } catch (error) {
      // Si ocurre un error, revertimos la transacción
      await queryRunner.rollbackTransaction();
      throw error; // Re-lanzamos el error para que se registre
    } finally {
      // Liberamos el query runner
      await queryRunner.release();
    }

    // Función auxiliar para registrar y loguear usuarios
    const registerAndLogin = async (userData: any, roleId: number) => {
      let res = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userData,
          idRole: roleId,
        });
      expect(res.status).toBe(HttpStatus.CREATED);
      const userId = res.body.idUser;

      res = await request(app.getHttpServer()).post('/auth/login').send({
        email: userData.email,
        password: userData.password,
      });
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('access_token');
      const token = res.body.access_token;
      return { token, userId };
    };

    // Registrar admin y usuario normal
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass',
      phone: '111111111',
    };
    const { token: adminTokenResult, userId: adminUserIdResult } =
      await registerAndLogin(adminData, adminRole.idRole);
    adminToken = adminTokenResult;
    adminUserId = adminUserIdResult;

    const userEmail = `user_${Date.now()}_${Math.random()}@example.com`;

    const userData = {
      name: 'Normal User',
      email: userEmail,
      password: 'userpass',
      phone: '222222222',
    };
    const { token: userTokenResult, userId: normalUserIdResult } =
      await registerAndLogin(userData, userRole.idRole);
    userToken = userTokenResult;
    normalUserId = normalUserIdResult;
  });

  afterAll(async () => {
    await app.close(); // Cerrar la aplicación después de las pruebas
  });

  // Test: Acceso permitido a admin a un endpoint restringido
  it('GET /roles/:id - acceso permitido a admin', async () => {
    const res = await request(app.getHttpServer())
      .get(`/roles/1`)
      .set('Authorization', `Bearer ${adminToken}`); // Usar token admin
    expect(res.status).toBe(HttpStatus.OK); // Verificar que se permite el acceso
  });

  // Test: Acceso denegado a usuario normal a un endpoint restringido
  it('GET /roles/:id - acceso denegado a usuario normal', async () => {
    const res = await request(app.getHttpServer())
      .get(`/roles/1`)
      .set('Authorization', `Bearer ${userToken}`); // Usar token de usuario normal
    expect(res.status).toBe(HttpStatus.FORBIDDEN); // Debe fallar con 403 Forbidden
  });
});
