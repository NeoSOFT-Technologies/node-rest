import { Transport } from '@nestjs/microservices';

export const transportOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.MICRO_SERVICE_HOST,
    port: process.env.MICRO_SERVICE_PORT,
  },
};
