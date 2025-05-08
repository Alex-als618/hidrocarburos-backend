import { Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
@Index('idx_unique_role_name', ['role_name'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'role_name' })
  roleName: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, user => user.role)
  users: User[];
}