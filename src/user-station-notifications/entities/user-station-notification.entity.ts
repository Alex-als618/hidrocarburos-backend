import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique
  } from 'typeorm';
  
  @Entity('user_station_notifications')
  @Unique(['user', 'fuel_station'])
  export class UserStationNotification {
    @PrimaryGeneratedColumn()
    id_user_station_notification: number;
  
    @Column()
    subscribed: boolean;
  
    @Column({ type: 'timestamp' })
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    updated_at: Date;
  }  