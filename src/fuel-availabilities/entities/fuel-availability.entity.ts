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
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';
import { FuelType } from '../../fuel-types/entities/fuel-type.entity';

@Index('idx_fuel_station_fuel_type', ['id_fuel_station', 'id_fuel_type'], { unique: true })
@Entity('fuel_availability')
export class FuelAvailability {
  @PrimaryGeneratedColumn({ name: 'id_fuel_availability' })
  idFuelAvailability: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'available_quantity' })
  availableQuantity: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'id_fuel_station' })
  idFuelStation: number;

  @Column({ name: 'id_fuel_type' })
  idFuelType: number;

  @ManyToOne(() => FuelStation, fs => fs.fuelAvailabilities)
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;

  @ManyToOne(() => FuelType, ft => ft.fuelAvailabilities)
  @JoinColumn({ name: 'id_fuel_type' })
  fuelType: FuelType;
}  