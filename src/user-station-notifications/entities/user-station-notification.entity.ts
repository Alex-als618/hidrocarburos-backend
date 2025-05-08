import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';

@Entity('user_station_notifications')
//@Index('idx_user_fuel_station', ['id_user', 'id_fuel_station'], { unique: true })
@Index('idx_user_station', ['id_user', 'id_fuel_station'], { unique: true })
export class UserStationNotification {
  @PrimaryGeneratedColumn({ name: 'id_user_station_notification' })
  idUserStationNotification: number;

  @Column()
  subscribed: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'id_user' })
  idUser: number;

  @Column({ name: 'id_fuel_station' })
  idFuelStation: number;

  @ManyToOne(() => User, user => user.userStationNotifications)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => FuelStation, fs => fs.userStationNotifications)
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;
}  