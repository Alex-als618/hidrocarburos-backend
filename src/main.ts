import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// import { AppDataSource } from './data-source';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //add
  //CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'https://tudominio.com'], // permite solo estos orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //SEEDER
  // AppDataSource.initialize()
  //   .then(() => {
  //     console.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     console.error('Error during Data Source initialization:', err);
  //   });
  //add

  // Configurar Helmet globalmente
  app.use(helmet());

  // filtro global de excepciones
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  // Validación de datos global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
