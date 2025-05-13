import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Carga variables del .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true,
});
