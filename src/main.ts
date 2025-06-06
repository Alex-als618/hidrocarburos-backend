import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule /*, { cors: true }*/,
  );
  app.setGlobalPrefix('api');

  //add
  //CORS
  // para todos
  //app.enableCors({});

  //para origin en especifico
  // app.enableCors({
  //   origin: ['http://localhost:4200', 'https://tudominio.com'], // permite solo estos orígenes
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // Imagenes
  // app.useStaticAssets(join(__dirname, '..', 'uploads/images'));
  app.useStaticAssets(
    join(__dirname, '..', 'uploads', 'images', 'station-images'),
    { prefix: '/uploads/images/station-images/' },
  );

  //SEEDER
  //add

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
