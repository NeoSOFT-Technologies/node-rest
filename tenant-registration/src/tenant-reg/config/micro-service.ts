import { registerAs } from '@nestjs/config';

export default registerAs('microservice', () => ({
  host: process.env.MICRO_SERVICE_HOST || 'localhost',
  port: process.env.MICRO_SERVICE_PORT || 8875,
}));
