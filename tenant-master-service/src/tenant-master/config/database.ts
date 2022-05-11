import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
}));
