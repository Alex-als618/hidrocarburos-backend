import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

// Pruebas e2e para autorización basada en roles: se verifica acceso permitido/denegado según rol.
describe('Authorization (Admin) (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let adminToken: string;
  let adminUserId: number;
  let userToken: string;
  let normalUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Habilitar validaciones globales
    await app.init();

    userRepo = moduleFixture.get(getRepositoryToken(User));
    roleRepo = moduleFixture.get(getRepositoryToken(Role));

    // Limpiar las tablas para asegurar que no haya datos residuales
    await userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await roleRepo.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    // Crear roles
    let adminRole = await roleRepo.findOneBy({ roleName: 'admin' });
    if (!adminRole) {
      await roleRepo.save({
        roleName: 'admin',
        description: 'Rol de administrador',
      });
      adminRole = await roleRepo.findOneBy({ roleName: 'admin' });
    }
    if (!adminRole) {
      throw new Error('No se pudo crear ni encontrar el rol admin');
    }

    let userRole = await roleRepo.findOneBy({ roleName: 'user' });
    if (!userRole) {
      await roleRepo.save({
        roleName: 'user',
        description: 'Rol de usuario regular',
      });
      userRole = await roleRepo.findOneBy({ roleName: 'user' });
    }
    if (!userRole) {
      throw new Error('No se pudo crear ni encontrar el rol user');
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
      const token = res.body.token;
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

    const userData = {
      name: 'Normal User',
      email: 'user@example.com',
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
