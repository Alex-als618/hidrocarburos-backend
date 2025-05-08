import { Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { FuelAvailability } from '../../fuel-availabilities/entities/fuel-availability.entity';

@Entity('fuel_types')
@Index('idx_unique_fuel_name', ['fuel_name'], { unique: true })
export class FuelType {
  @PrimaryGeneratedColumn({ name: 'id_fuel_type' })
  idFuelType: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'fuel_name' })
  fuelName: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FuelAvailability, fa => fa.fuelType)
  fuelAvailabilities: FuelAvailability[];
}