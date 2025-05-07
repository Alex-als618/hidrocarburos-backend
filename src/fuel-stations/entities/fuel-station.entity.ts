import { 
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';
@Entity('fuel_stations')
export class FuelStation {
  @PrimaryGeneratedColumn()
  id_fuel_station: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  municipality: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'numeric', precision: 9, scale: 6 })
  gps_latitude: number;

  @Column('numeric', { precision: 9, scale: 6 })
  gps_longitude: number;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}