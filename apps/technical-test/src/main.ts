import { NestFactory } from '@nestjs/core';
import { TechnicalTestModule } from './technical-test.module';

async function bootstrap() {
  const app = await NestFactory.create(TechnicalTestModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
