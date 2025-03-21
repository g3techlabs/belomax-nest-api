import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*',
  });

  await app.listen(PORT, () => {
    console.log(`[BELOMAX-API] HTTP server is running on port ${PORT} 🚀`);
  });
}

bootstrap();
