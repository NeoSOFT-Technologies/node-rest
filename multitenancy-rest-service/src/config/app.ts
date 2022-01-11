import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'multitenancy-rest-service',
  version: process.env.API_VERSION || 'v1',
  env: process.env.APP_ENV || 'local',
  port: +process.env.APP_PORT || 5000,
}));
