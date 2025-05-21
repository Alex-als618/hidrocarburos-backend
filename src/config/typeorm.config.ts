import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

//quitar el example del env
//ignorar el docker-compose.yml si usa postgres local
// cambiar todo lo que use el AppDataSource de data-source.ts por el typeormConfig
export const typeormConfig = (configService: ConfigService): TypeOrmModule => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [join(__dirname + '../../**/*.entity{.ts,.js}')],
  synchronize: true,
});
