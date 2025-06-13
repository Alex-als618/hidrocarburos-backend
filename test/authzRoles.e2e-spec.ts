import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

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
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepo = moduleFixture.get(getRepositoryToken(User));
    roleRepo = moduleFixture.get(getRepositoryToken(Role));

    // Limpiar tablas
    await userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await roleRepo.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    // Función auxiliar para registrar y loguear usuarios (DRY)
    const registerAndLogin = async (userData: any, roleId: number) => {
      let res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...userData,
          idRole: roleId,
        });
      expect(res.status).toBe(HttpStatus.CREATED);
      const userId = res.body.user.idUser;

      res = await request(app.getHttpServer()).post('/auth/login').send({
        email: userData.email,
        password: userData.password,
      });
      expect(res.status).toBe(HttpStatus.OK);
      const token = res.body.token;
      return { token, userId };
    };

    // Crear roles
    const adminRole = await roleRepo.save({
      roleName: 'admin',
      description: 'Rol de administrador',
    });
    const userRole = await roleRepo.save({
      roleName: 'user',
      description: 'Rol de usuario regular',
    });

    // Registrar y loguear usuario admin y normal
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
    await app.close();
  });

  // Test: Acceso con token admin a un endpoint restringido a admin o manager.
  it('GET /roles/:id - acceso permitido a admin', async () => {
    //endpoint GET /roles/:id está protegido con roles: ['admin', 'manager']
    const res = await request(app.getHttpServer())
      .get(`/roles/1`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(HttpStatus.OK);
  });

  // Test: Acceso con token de usuario normal a un endpoint restringido (debe fallar con 403 Forbidden).
  it('GET /roles/:id - acceso denegado a usuario normal', async () => {
    const res = await request(app.getHttpServer())
      .get(`/roles/1`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(HttpStatus.FORBIDDEN);
  });
});
