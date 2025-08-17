import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { BadRequestException } from '@nestjs/common';

/*
  * Test unitario:
  ? Verifica el comportamiento de UsersService de forma aislada.
  ? No se usa la app completa ni peticiones HTTP.
  ? Se simulan los repositorios con mocks para controlar su comportamiento.
*/

// * Simulación del repositorio de usuarios (User)
const mockUserRepository = {
  findOneBy: jest.fn(), // ? Simula la búsqueda de un usuario por algún campo
  save: jest.fn(), // ? Simula el guardado en base de datos
  create: jest.fn(), // ? Simula la creación de una instancia de entidad
};

// * Simulación del repositorio de roles (Role)
const mockRoleRepository = {
  findOneBy: jest.fn(),
};

describe('UsersService Unit Tests', () => {
  let service: UsersService;
  let userRepository: typeof mockUserRepository;

  // * Se ejecuta antes de cada prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // * Reemplaza el repositorio real de User con un mock
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          // * Reemplaza el repositorio de Role con un mock
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  // * Verifica que el servicio haya sido creado correctamente
  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('debería lanzar BadRequestException si el email ya existe', async () => {
      // ! Simulamos que ya existe un usuario con ese email
      mockUserRepository.findOneBy.mockResolvedValue({
        idUser: 1,
        email: 'test@example.com',
      });

      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com', // ! Email duplicado
        password: 'password123',
        phone: '123456789',
        idRole: 1,
      };

      // * Esperamos que se lance una excepción de tipo BadRequest
      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );

      // * Verifica que el método findOneBy se haya llamado correctamente
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  // * Limpia todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });
});
