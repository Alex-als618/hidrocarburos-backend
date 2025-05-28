import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    const role = this.rolesRepository.findOneBy({ idRole: id });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesRepository.preload({
      idRole: id,
      ...updateRoleDto,
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return await this.rolesRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findOneBy({ idRole: id });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    await this.rolesRepository.remove(role);
    return role;
  }
}
