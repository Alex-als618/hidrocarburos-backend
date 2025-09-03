import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../common/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  // Mock de estación (si es usado por usuario)
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

  const mockUser = {
    idUser: 1,
    email: 'test@example.com',
    password: 'oldHash',
    fullName: 'Test User Test', // Add fullName to mockUser
    resetToken: 'valid-token',
    tokenExpiration: new Date(Date.now() + 10000),
    name: 'Test User',
    lastname: 'Test',
    phone: '123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
    idRole: 1,
    role: {
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
    jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('newHashedPassword123' as never);

    // Mock the findOneByResetToken to return a user with fullName
    usersService = {
      findOneByResetToken: jest
        .fn()
        .mockResolvedValue({ ...mockUser, fullName: 'Test User Test' }), // Ensure fullName is present
      update: jest
        .fn()
        .mockResolvedValue({ ...mockUser, password: 'newHashedPassword123' }),
      findOneByEmail: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
      // Add findOne to usersService mock if it's used in auth.service
      findOne: jest.fn().mockResolvedValue(mockUser),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: MailService, useValue: { sendPasswordReset: jest.fn() } },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret'; // Ensure JWT_SECRET is provided
              if (key === 'JWT_EXPIRES_IN') return '1h';
              return null;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('debe actualizar la contraseña si el token es válido y no ha expirado', async () => {
      const newPassword = 'NewPass123';
      const expectedHashedPassword = 'newHashedPassword123';
      const result = await authService.resetPassword(
        'valid-token',
        newPassword,
      );

      expect(result).toBe('Contraseña actualizada correctamente');
      expect(usersService.findOneByResetToken).toHaveBeenCalledWith(
        'valid-token',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.idUser,
        expect.objectContaining({
          password: expectedHashedPassword,
        }),
      );
    });

    it('debe lanzar error si el token no existe', async () => {
      jest.spyOn(usersService, 'findOneByResetToken').mockResolvedValue(null);

      await expect(
        authService.resetPassword('invalid-token', 'NewPass123'),
      ).rejects.toThrow('Token inválido');

      expect(usersService.findOneByResetToken).toHaveBeenCalledWith(
        'invalid-token',
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('debe lanzar error si el token está expirado', async () => {
      jest.spyOn(usersService, 'findOneByResetToken').mockResolvedValue({
        ...mockUser,
        tokenExpiration: new Date(Date.now() - 10000),
      });

      await expect(
        authService.resetPassword('valid-token', 'NewPass123'),
      ).rejects.toThrow('Token expirado');

      expect(usersService.findOneByResetToken).toHaveBeenCalledWith(
        'valid-token',
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(usersService.update).not.toHaveBeenCalled();
    });
  });
});
