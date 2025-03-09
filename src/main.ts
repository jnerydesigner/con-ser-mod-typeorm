import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get<number>('SERVER_PORT', 3000);
  const logger = new Logger();
  await app.listen(PORT, () => {
    logger.log(`Server running in port: ${PORT}`);
  });
}
bootstrap();
