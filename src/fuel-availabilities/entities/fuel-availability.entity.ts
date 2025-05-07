import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique
  } from 'typeorm';
  
  @Entity('fuel_availability')
  @Unique(['fuel_station', 'fuel_type'])
  export class FuelAvailability {
    @PrimaryGeneratedColumn()
    id_fuel_availability: number;
  
    @Column('numeric', { precision: 10, scale: 2 })
    available_quantity: number;
  
    @Column({ type: 'timestamp' })
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    updated_at: Date;
  }  