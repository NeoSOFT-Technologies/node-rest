import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { transportOptions } from './transport/transport';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    transportOptions,
  );
  await app.listen();
}
bootstrap();
