import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
  });

  await app.listen(PORT, () => {
    const logger = new Logger(NestApplication.name);
    logger.log(`BELOMAX API HTTP server is running on port ${PORT}`);
  });
}

bootstrap();
