import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

/*
  * Test de integración:
  ? Verifica que varios componentes trabajen juntos correctamente.
  ? En este caso, se prueba el endpoint POST /users usando la app completa:
    - Controlador
    - Servicio
    - Pipes de validación
    - Base de datos real
    - Peticiones HTTP simuladas con supertest
*/

describe('UsersController (Integración)', () => {
  let app: INestApplication;

  // * Se ejecuta una vez antes de todas las pruebas
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // * Carga toda la aplicación
    }).compile();

    app = moduleFixture.createNestApplication();

    // * Aplica los mismos pipes globales que se usan en main.ts
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init(); // * Inicializa la app para pruebas
  });

  // * Se ejecuta una vez después de todas las pruebas
  afterAll(async () => {
    await app.close(); // * Libera recursos
  });

  it('POST /users → debe crear un nuevo usuario', async () => {
    // TODO: Evita duplicados generando un email único
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    const newUser = {
      email: uniqueEmail,
      password: 'SecurePassword123',
      name: 'Test User',
      phone: '123456789',
      idRole: 1, // ! Este ID debe existir en la tabla de roles
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    // ! Solo mostramos logs si el test falla
    try {
      expect(response.status).toBe(201); // * Esperamos un código HTTP 201 (Created)
      expect(response.body).toHaveProperty('email', newUser.email);
      expect(response.body).toHaveProperty('name', newUser.name);
    } catch (error) {
      console.log('Test de integración fallido');
      console.log('Status:', response.status);
      console.log('Body:', response.body);
      throw error;
    }
  });
});
