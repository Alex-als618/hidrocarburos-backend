import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// import { AppDataSource } from './data-source';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule /*, { cors: true }*/,
  );
  app.setGlobalPrefix('api');

  //SEEDER
  // AppDataSource.initialize()
  //   .then(() => {
  //     console.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     console.error('Error during Data Source initialization:', err);
  //   });
  //add

  // Configuración global de seguridad HTTP con Helmet para proteger la app de vulnerabilidades comunes.
  app.use(helmet());

  // filtro global de excepciones personalizado.
  // Permite manejar errores de forma coherente en toda la API, devolviendo respuestas estructuradas.
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  // Validación de datos global
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
