import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';
import { FuelType } from '../../fuel-types/entities/fuel-type.entity';

@Index('idx_fuel_station_fuel_type', ['idFuelStation', 'idFuelType'], {
  unique: true,
})
@Entity('fuel_availability')
export class FuelAvailability {
  @PrimaryGeneratedColumn({ name: 'id_fuel_availability' })
  idFuelAvailability: number;

  @Column({
    name: 'available_quantity',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  availableQuantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'id_fuel_station' })
  idFuelStation: number;

  @Column({ name: 'id_fuel_type' })
  idFuelType: number;

  @ManyToOne(() => FuelStation, (fs) => fs.fuelAvailabilities)
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;

  @ManyToOne(() => FuelType, (ft) => ft.fuelAvailabilities)
  @JoinColumn({ name: 'id_fuel_type' })
  fuelType: FuelType;
}
