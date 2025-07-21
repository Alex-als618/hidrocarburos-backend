import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/mail/mail.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>; // Usa Partial para facilitar el mocking

  // Definir mockFuelStation si es relevante para tus usuarios
  const mockFuelStation = {
    id: 1,
    idFuelStation: 1,
    name: 'Mock Fuel Station',
    address: '123 Main St',
    municipality: 'Mock Municipality',
    gpsLatitude: 0.0,
    gpsLongitude: 0.0,
    phone: '0000000000',
    email: 'station@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    fuelAvailabilities: [],
    users: [],
    userStationNotifications: [],
    stationImages: [],
  };

  // Definir el mockUser para las pruebas
  const mockUser = {
    idUser: 1,
    email: 'test@example.com',
    password: 'oldHash', // Esto sería el hash de la contraseña original para simular el estado persistido
    resetToken: 'valid-token',
    tokenExpiration: new Date(Date.now() + 10000), // Token no expirado (10 segundos en el futuro)
    name: 'Test User',
    phone: '123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
    idRole: 1,
    role: { // Objeto completo del rol
      idRole: 1,
      roleName: 'user',
      description: 'Rol básico para pruebas',
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
    },
    fuelStation: mockFuelStation,
    userStationNotifications: [],
  };

  beforeEach(async () => {
    // 1. Mockear la función bcrypt.hash antes de la creación del módulo de prueba
    // Esto es crucial para controlar lo que bcrypt.hash devuelve.
    // Asumimos que siempre devolverá un hash predefinido para propósitos de prueba.
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword123' as never); // Mockea el resultado del hash

    usersService = {
      // Configura mockResolvedValue por defecto para findOneByResetToken y update
      findOneByResetToken: jest.fn().mockResolvedValue({ ...mockUser }), // Retorna una copia para no mutar el original
      update: jest.fn().mockResolvedValue({ ...mockUser, password: 'newHashedPassword123' }), // Mockea el resultado de la actualización
      // Si tu AuthService usa otros métodos de UsersService (ej. findByEmail, create), también deberías mockearlos aquí.
      findOneByEmail: jest.fn().mockResolvedValue(mockUser), // Ejemplo de otro mock si es necesario
      create: jest.fn().mockResolvedValue(mockUser), // Ejemplo de otro mock si es necesario
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: MailService, useValue: { sendPasswordReset: jest.fn() } }, // Mockea MailService con un método si AuthService lo llama
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  // Limpia los mocks después de cada prueba para evitar que afecten a otras
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('debe actualizar la contraseña si el token es válido y no ha expirado', async () => {
      const newPassword = 'NewPass123';
      const expectedHashedPassword = 'newHashedPassword123'; // El valor que mockeamos para bcrypt.hash
      const result = await authService.resetPassword('valid-token', newPassword);

      expect(result).toBe('Contraseña actualizada correctamente');
      // Verifica que findOneByResetToken fue llamado con el token correcto
      expect(usersService.findOneByResetToken).toHaveBeenCalledWith('valid-token');
      // Verifica que bcrypt.hash fue llamado con la nueva contraseña y los salt rounds
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10); // Asumiendo saltRounds de 10
      // Verifica que usersService.update fue llamado con el ID de usuario y el nuevo hash,
      // y que el token y la expiración se han reseteado a null
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.idUser,
        expect.objectContaining({
          password: expectedHashedPassword,
          resetToken: null,
          tokenExpiration: null,
        }),
      );
    });

    it('debe lanzar error si el token no existe', async () => {
      // Sobrescribe el mock por defecto para que devuelva null
      jest.spyOn(usersService, 'findOneByResetToken').mockResolvedValue(null);

      await expect(authService.resetPassword('invalid-token', 'NewPass123'))
        .rejects
        .toThrow('Token inválido'); // El mensaje de error debe coincidir con el de tu AuthService

      expect(usersService.findOneByResetToken).toHaveBeenCalledWith('invalid-token');
      expect(bcrypt.hash).not.toHaveBeenCalled(); // No debe hashear si el token no existe
      expect(usersService.update).not.toHaveBeenCalled(); // No debe actualizar si el token no existe
    });

    it('debe lanzar error si el token está expirado', async () => {
      // Sobrescribe el mock por defecto para que devuelva un usuario con token expirado
      jest.spyOn(usersService, 'findOneByResetToken').mockResolvedValue({
        ...mockUser, // Copia las propiedades básicas
        tokenExpiration: new Date(Date.now() - 10000), // ¡Token expirado hace 10 segundos!
      });

      await expect(authService.resetPassword('valid-token', 'NewPass123'))
        .rejects
        .toThrow('Token expirado'); // El mensaje de error debe coincidir con el de tu AuthService

      expect(usersService.findOneByResetToken).toHaveBeenCalledWith('valid-token');
      expect(bcrypt.hash).not.toHaveBeenCalled(); // No debe hashear si el token expiró
      expect(usersService.update).not.toHaveBeenCalled(); // No debe actualizar si el token expiró
    });
  });
});