import { Transport } from '@nestjs/microservices';

console.log(process.env.MICRO_SERVICE_HOST);
console.log(typeof process.env.MICRO_SERVICE_PORT);

export const transportOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.MICRO_SERVICE_HOST,
    port: process.env.MICRO_SERVICE_PORT,
  },
};
