import {
    Entity,
    PrimaryGeneratedColumn,
    Column
  } from 'typeorm';
  
  @Entity('station_images')
  export class StationImage {
    @PrimaryGeneratedColumn()
    id_station_image: number;
  
    @Column({ type: 'varchar', length: 255 })
    image_url: string;
  
    @Column({ type: 'varchar', length: 255 })
    description: string;
  
    @Column({ type: 'timestamp' })
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    updated_at: Date;
  }  