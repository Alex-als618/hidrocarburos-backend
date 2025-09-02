import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('roles')
@Index('idx_unique_role_name', ['roleName'], { unique: true })
export class Role {
  @ApiProperty({
    example: 1,
    description: 'ID único del rol',
  })
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Nombre del rol. Debe ser único y tener hasta 50 caracteres',
  })
  @Column({ name: 'role_name', type: 'varchar', length: 50, unique: true })
  roleName: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional del rol',
    example: 'Rol con acceso completo al sistema',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-09-01T22:16:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-09-01T22:16:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Lista de usuarios que tienen este rol',
    type: () => [User],
  })
  @OneToMany(() => User, (user) => user.role, { onDelete: 'CASCADE' })
  users: User[];
}
