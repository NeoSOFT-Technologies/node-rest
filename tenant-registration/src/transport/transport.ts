import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const transportOptions = (config: ConfigService) => {
  return {
    transport: Transport.TCP,
    options: {
      host: config.get('microservice.host'),
      port: config.get('microservice.port'),
    },
  };
};
