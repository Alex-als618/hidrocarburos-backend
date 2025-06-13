import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

// usar npm run test:e2e, para ejecutar este test

describe('AuthController and validations (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let jwtToken: string;
  let createdUserId: number;

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

    // Crear rol necesario
    await roleRepo.save({
      roleName: 'user',
      description: 'Rol básico para pruebas',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // Test: Registro exitoso de usuario
  it('POST /auth/register - registra un usuario', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: '12345678',
      phone: '123456789',
      idRole: 1,
    });

    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.user).toHaveProperty('idUser');
    createdUserId = res.body.user.idUser;
  });

  // Test: Evitar doble registro (email duplicado)
  it('POST /auth/register - falla si el email ya existe', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: '12345678',
      phone: '123456789',
      idRole: 1,
    });

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toMatch(/email.*exist/i);
  });

  // Test: Login con email incorrecto
  it('POST /auth/login - falla con email incorrecto', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'inexistente@example.com',
      password: '12345678',
    });

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body.message).toMatch(/credentials/i);
  });

  // Test: Login con contraseña incorrecta
  it('POST /auth/login - falla con contraseña incorrecta', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@example.com',
      password: 'contarseñaIncorrecta',
    });

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body.message).toMatch(/credentials/i);
  });

  // Test: Login exitoso y generación de JWT
  it('POST /auth/login - genera un JWT', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@example.com',
      password: '12345678',
    });

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty('token');
    jwtToken = res.body.token;
  });

  // Test: Acceso a endpoint protegido sin token
  it('GET /users/:id - falla sin token', async () => {
    const res = await request(app.getHttpServer()).get(
      `/users/${createdUserId}`,
    );
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  // Test: Acceso a endpoint protegido con JWT inválido
  it('GET /users/:id - falla con token inválido', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer tokenInvalido`);
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  // Test: Acceso a endpoint protegido con JWT válido
  it('GET /users/:id - accede a un endpoint protegido con JWT', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty('idUser', createdUserId);
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body.role).toHaveProperty('roleName', 'user');
  });
});
