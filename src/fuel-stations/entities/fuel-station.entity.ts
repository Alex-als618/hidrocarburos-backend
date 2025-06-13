import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuelAvailability } from '../../fuel-availabilities/entities/fuel-availability.entity';
import { User } from '../../users/entities/user.entity';
import { UserStationNotification } from '../../user-station-notifications/entities/user-station-notification.entity';
import { StationImage } from '../../station-images/entities/station-image.entity';

@Entity('fuel_stations')
export class FuelStation {
  @PrimaryGeneratedColumn({ name: 'id_fuel_station' })
  idFuelStation: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  municipality: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ name: 'gps_latitude', type: 'numeric', precision: 9, scale: 6 })
  gpsLatitude: number;

  @Column({ name: 'gps_longitude', type: 'numeric', precision: 9, scale: 6 })
  gpsLongitude: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FuelAvailability, (fa) => fa.fuelStation)
  fuelAvailabilities: FuelAvailability[];

  @OneToMany(() => User, (user) => user.fuelStation)
  users: User[];

  @OneToMany(() => UserStationNotification, (usn) => usn.fuelStation)
  userStationNotifications: UserStationNotification[];

  @OneToMany(() => StationImage, (stnimg) => stnimg.fuelStation)
  stationImages: StationImage[];
}
