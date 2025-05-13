import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';

@Entity('station_images')
export class StationImage {
  @PrimaryGeneratedColumn({ name: 'id_station_image' })
  idStationImage: number;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => FuelStation, (fs) => fs.stationImages)
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;
}
