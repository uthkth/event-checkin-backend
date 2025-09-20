// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow frontend to call API (we’ll set CORS_ORIGIN in Render)
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  });

  const port = process.env.PORT || 5000; // Render provides PORT
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend running on: http://localhost:${port}`);
}
bootstrap();
