import { Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}