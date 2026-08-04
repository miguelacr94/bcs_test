import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { configureTracing } from '@app/shared/tracing/tracing.config';
import { TracingInterceptor } from '@app/shared/interceptors/tracing.interceptor';
import { EncryptIdInterceptor } from '@app/shared/interceptors/encrypt-id.interceptor';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitamos CORS para que el frontend pueda conectarse

  // Configurar tracing
  configureTracing({
    enabled: true,
    serviceName: 'api-gateway',
    sampleRate: 1.0,
    logLevel: 'INFO',
    logToConsole: true,
  });

  const tracingClient = ClientProxyFactory.create({
    transport: Transport.REDIS,
    options: { host: envs.redis.host, port: envs.redis.port },
  });

  // Activamos validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades extrañas que no tengan decoradores en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se mandan propiedades no permitidas en el body
      transform: true, // Convierte automáticamente tipos de datos en la entrada
      stopAtFirstError: true, // Detiene las validaciones al primer error de cada campo
    }),
  );
  // Todas las rutas empezarán con /api
  app.setGlobalPrefix('api');
  // Habilitamos el versionamiento por URL (v1, v2, etc)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Por defecto todas las rutas serán v1
  });

  // Activamos el filtro global de excepciones unificado
  app.useGlobalFilters(new AllExceptionsFilter());

  // Activamos el interceptor global de rendimiento y cifrado de IDs
  app.useGlobalInterceptors(
    new CacheInterceptor(),
    new PerformanceInterceptor(),
    new TimeoutInterceptor(),
    new TransformInterceptor(),
    new EncryptIdInterceptor(),
    new TracingInterceptor(tracingClient),
  );
  // Configuración de Swagger (OpenAPI) para documentación de APIs
  const config = new DocumentBuilder()
    .setTitle('Store Monorepo API')
    .setDescription(
      'Documentación interactiva de las APIs del API Gateway y microservicios',
    )
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
