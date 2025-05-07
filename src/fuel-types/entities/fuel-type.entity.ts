import { Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity('fuel_types')
export class FuelType {
  @PrimaryGeneratedColumn()
  id_fuel_type: number;

  @Column({ type: 'varchar', length: 50, unique: true, })
  fuel_name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}