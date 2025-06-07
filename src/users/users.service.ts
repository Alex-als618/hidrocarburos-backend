import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { hashPassword } from 'src/common/utils/password-hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // creo que hashear la contraseña sin importar que sea post/register o post/users
  async create(createUserDto: CreateUserDto) {
    const { idRole, ...rest } = createUserDto;

    let role: Role | null;
    if (idRole) {
      role = await this.roleRepository.findOneBy({ idRole });
      if (!role) throw new NotFoundException(`Role ID ${idRole} not found`);
    } else {
      role = await this.roleRepository.findOneBy({ roleName: RoleEnum.USER });
      if (!role) throw new NotFoundException(`Default user role not found`);
    }

    const user = this.userRepository.create({
      ...rest,
      role,
    });

    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ idUser: id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { idRole, ...rest } = updateUserDto;

    let role: Role | null = null;
    if (idRole) {
      role = await this.roleRepository.findOneBy({ idRole });
      if (!role) throw new NotFoundException(`Role ID ${idRole} not found`);
    }

    const user = await this.userRepository.preload({
      idUser: id,
      ...rest,
      ...(role !== null ? { role } : {}),
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.password) {
      user.password = await hashPassword(updateUserDto.password);
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ idUser: id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.remove(user);
    return user;
  }
}
