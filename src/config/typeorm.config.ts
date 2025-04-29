import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

//quitar el example del env
//ignorar el docker-compose.yml si usa postgres local
export const typeormConfig = (configService: ConfigService): TypeOrmModule => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  entities: [join(__dirname + '../../**/*.entity{.ts,.js}')],
  synchronize: true,
});