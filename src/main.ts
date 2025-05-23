import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Disposition']
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.setGlobalPrefix('api');

  await app.listen(PORT, () => {
    const logger = new Logger(NestApplication.name);
    logger.log(`BELOMAX API HTTP server is running on port ${PORT}`);
  });
}

bootstrap();
