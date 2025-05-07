import {
    Entity,
    PrimaryGeneratedColumn,
    Column
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id_user: number;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;
  
    @Column({ type: 'varchar', length: 255 })
    password: string;
  
    @Column({ type: 'varchar', length: 20 })
    phone: string;
  
    @Column({ type: 'timestamp' })
    created_at: Date;
  
    @Column({ type: 'timestamp' })
    updated_at: Date;
  }  