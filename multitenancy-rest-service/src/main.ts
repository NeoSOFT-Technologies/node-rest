import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupLogger } from './logger';
import { setupSwagger } from './swagger';
import { setupCors } from './utils/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const PORT = config.get('app.port');

  const envList = ['dev', 'staging', 'local', 'test'];

  if (envList.includes(config.get('app.env'))) {
    setupSwagger(app);
    setupCors(app);
  }
  setupLogger(app);
  await app.listen(PORT, () => {
    console.log(`Listening on ::${PORT}`);
  });
}
bootstrap();
