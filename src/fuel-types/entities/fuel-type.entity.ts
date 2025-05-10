import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { FuelAvailability } from '../../fuel-availabilities/entities/fuel-availability.entity';

@Entity('fuel_types')
@Index('idx_unique_fuel_name', ['fuelName'], { unique: true })
export class FuelType {
  @PrimaryGeneratedColumn({ name: 'id_fuel_type' })
  idFuelType: number;

  @Column({ name: 'fuel_name', type: 'varchar', length: 50, unique: true })
  fuelName: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FuelAvailability, (fa) => fa.fuelType)
  fuelAvailabilities: FuelAvailability[];
}
