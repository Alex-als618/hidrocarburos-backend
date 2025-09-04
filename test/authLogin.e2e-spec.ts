import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

// usar npm run test:e2e, para ejecutar los test
// usar npm run test:e2e -- --runInBand, para ejecutar uno por uno

/* 
 considerar usar una configuracion global de globalSetup y globalTeardown,
 si es necesrio ya que esto es un proyecto mediano 
*/

// Pruebas end-to-end para AuthController: registro, login, validaciones y acceso protegido con JWT.
describe('AuthController and validations (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let jwtToken: string;
  let createdUserId: number;
  let userRole: Role | null;

  beforeAll(async () => {
    // Configuración inicial del módulo de pruebas
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Importar el módulo principal de la aplicación
    }).compile();

    // Inicializar la aplicación NestJS
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe()); // Usar pipes globales para validaciones
    await app.init();

    // Obtener los repositorios necesarios
    userRepo = moduleFixture.get(getRepositoryToken(User));
    roleRepo = moduleFixture.get(getRepositoryToken(Role));

    // Limpiar las tablas para asegurar que las pruebas sean consistentes
    await userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await roleRepo.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    // Crear un rol básico para las pruebas de autenticación
    userRole = await roleRepo.findOneBy({ roleName: 'user' });
    if (!userRole) {
      await roleRepo.save({
        roleName: 'user',
        description: 'Rol básico para pruebas',
      });
      userRole = await roleRepo.findOneBy({ roleName: 'user' });
    }
    if (!userRole) {
      throw new Error('No se pudo crear ni encontrar el rol user');
    }
  });

  afterAll(async () => {
    await app.close(); // Cerrar la aplicación después de las pruebas
  });

  let uniqueEmail: string;

  // Test: Registro exitoso de usuario
  it('POST /api/auth/register - registra un usuario', async () => {
    uniqueEmail = `testuser_${Date.now()}@example.com`; // Email único para cada prueba
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '12345678',
        phone: '123456789',
        idRole: userRole?.idRole, // Asignación del rol de usuario
      });

    expect(res.status).toBe(HttpStatus.CREATED); // Esperamos un código 201 (Creado)
    expect(res.body.user).toHaveProperty('idUser'); // Verificar que se creó un usuario con id
    createdUserId = res.body.user.idUser; // Guardar el ID del usuario creado para pruebas posteriores
  });

  // Test: Evitar doble registro (email duplicado)
  it('POST /api/auth/register - falla si el email ya existe', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com', // Usar un email fijo para esta prueba
        password: '12345678',
        phone: '123456789',
        idRole: 1,
      });

    expect(res.status).toBe(HttpStatus.CREATED); // Usuario registrado exitosamente

    // Intentar registrar el mismo email
    const duplicateRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com', // Email duplicado
        password: '12345678',
        phone: '123456789',
        idRole: 1,
      });

    expect(duplicateRes.status).toBe(HttpStatus.BAD_REQUEST); // Esperamos un error 400 (Solicitud incorrecta)
    expect(duplicateRes.body.message).toMatch(/email.*exist/i); // Mensaje indicando que el email ya existe
  });

  // Test: Login con email incorrecto
  it('POST /api/auth/login - falla con email incorrecto', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'inexistente@example.com', // Email que no existe en la base de datos
        password: '12345678',
      });

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED); // Esperamos un error 401 (No autorizado)
    expect(res.body.message).toMatch(/credentials/i); // El mensaje debe mencionar que las credenciales son incorrectas
  });

  // Test: Login con contraseña incorrecta
  it('POST /api/auth/login - falla con contraseña incorrecta', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'contraseñaIncorrecta', // Contraseña incorrecta
      });

    expect(res.status).toBe(HttpStatus.UNAUTHORIZED); // Error 401 (No autorizado)
    expect(res.body.message).toMatch(/credentials/i); // Mensaje de error indicando que las credenciales no son válidas
  });

  // Test: Login exitoso y generación de JWT
  it('POST /api/auth/login - genera un JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: '12345678',
      });

    expect(res.status).toBe(HttpStatus.OK); // Esperamos un código 200 (OK)
    expect(res.body).toHaveProperty('access_token'); // Verificar que se generó un token JWT
    jwtToken = res.body.access_token; // Guardar el token para pruebas de acceso a rutas protegidas
  });

  // Test: Acceso a endpoint protegido sin token
  it('GET /api/users/:id - falla sin token', async () => {
    const res = await request(app.getHttpServer()).get(
      `/api/users/${createdUserId}`,
    );
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED); // Debe fallar con un error 401 (No autorizado)
  });

  // Test: Acceso a endpoint protegido con JWT inválido
  it('GET /api/users/:id - falla con token inválido', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer tokenInvalido`); // Token inválido
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED); // Error 401 (No autorizado)
  });

  // Test: Acceso a endpoint protegido con JWT válido
  it('GET /api/users/:id - accede a un endpoint protegido con JWT', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`); // Token JWT válido
    expect(res.status).toBe(HttpStatus.OK); // Respuesta exitosa (200 OK)
    expect(res.body).toHaveProperty('idUser', createdUserId); // Verificar que los datos del usuario coincidan
    expect(res.body).toHaveProperty('email', uniqueEmail); // Verificar que el email sea el mismo
    expect(res.body.role).toHaveProperty('roleName', 'user'); // Verificar que el rol sea el correcto
  });
});
