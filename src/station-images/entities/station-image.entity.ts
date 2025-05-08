import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';
  
  @Entity('station_images')
  export class StationImage {
    @PrimaryGeneratedColumn({ name: 'id_station_image' })
    idStationImage: number;
  
    @Column({ type: 'varchar', length: 255, name: 'image_url' })
    imageUrl: string;
  
    @Column({ type: 'varchar', length: 255 })
    description: string;
  
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
  
    @ManyToOne(() => FuelStation, fs => fs.stationImages)
    @JoinColumn({ name: 'id_fuel_station' })
    fuelStation: FuelStation;
  }  