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

@Entity('roles')
@Index('idx_unique_role_name', ['roleName'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ name: 'role_name', type: 'varchar', length: 50, unique: true })
  roleName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
