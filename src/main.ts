import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule /*, { cors: true }*/,
  );
  //const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name);
  const configService = app.get(ConfigService);
  // Global prefix desde .env
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

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
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

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

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Fuel Station API')
      .setDescription('API para gestión de estaciones de combustible')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  // Configuración de validación de datos global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Iniciar el servidor
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  Logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📍 API Base URL: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger Docs: http://localhost:${port}/docs`);
}
bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
});
