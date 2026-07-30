import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activamos validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Quita propiedades extrañas que no tengan decoradores en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se mandan propiedades no permitidas en el body
      transform: true,            // Convierte automáticamente tipos de datos en la entrada
      stopAtFirstError: true,     // Detiene las validaciones al primer error de cada campo
    }),
  );

  // Activamos el filtro global de excepciones unificado
  app.useGlobalFilters(new AllExceptionsFilter());

  // Activamos el interceptor global de rendimiento
  app.useGlobalInterceptors(
    new PerformanceInterceptor(),
    new TimeoutInterceptor(),
  );

  // Configuración de Swagger (OpenAPI) para documentación de APIs
  const config = new DocumentBuilder()
    .setTitle('Store Monorepo API')
    .setDescription('Documentación interactiva de las APIs del API Gateway y microservicios')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT obtenido del login',
        in: 'header',
      },
      'JWT-auth', // Nombre de clave para usar en controladores
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
