import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { FuelStation } from '../../fuel-stations/entities/fuel-station.entity';
import { UserStationNotification } from '../../user-station-notifications/entities/user-station-notification.entity';

@Entity('users')
@Index('idx_unique_user_email', ['email'], { unique: true })
export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @Column({ type: 'varchar', length: 255, name: 'last_name', nullable: true })
  lastName?: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@email.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña hasheada del usuario',
    example: '$2b$10$...',
  })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '70123456',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Refresh token (para autenticación con JWT)',
    example: 'eyJhbGciOi...',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'refresh_token',
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-08-30T00:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-08-30T00:00:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Token temporal para recuperación de contraseña',
    example: 'abc123resettoken',
  })
  @Column({ nullable: true })
  resetToken?: string;

  @ApiPropertyOptional({
    description: 'Fecha de expiración del token de recuperación',
    example: '2025-09-01T12:00:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  tokenExpiration: Date;

  @ApiProperty({
    description: 'Rol del usuario',
    type: () => Role,
  })
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @ApiPropertyOptional({
    description:
      'Estación de servicio a la que pertenece el usuario (si aplica)',
    type: () => FuelStation,
  })
  @ManyToOne(() => FuelStation, (fs) => fs.users, { nullable: true })
  @JoinColumn({ name: 'id_fuel_station' })
  fuelStation: FuelStation;

  @OneToMany(() => UserStationNotification, (usn) => usn.user)
  userStationNotifications: UserStationNotification[];

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  get fullName(): string {
    return [this.name, this.lastName].filter(Boolean).join(' ');
  }
}
