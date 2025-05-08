import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';
import { UserStationNotification } from '../../user-station-notifications/entities/user-station-notification.entity';

@Entity('users')
@Index('idx_unique_user_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @ManyToOne(() => FuelStation, fs => fs.users, { nullable: true })
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;

  @OneToMany(() => UserStationNotification, usn => usn.user)
  userStationNotifications: UserStationNotification[];
}  