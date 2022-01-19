import { registerAs } from '@nestjs/config';

export default registerAs('tenantdb', () => ({
  host: process.env.TENANT_DATABASE_HOST || '127.0.0.1',
  port: process.env.TENANT_DATABASE_PORT || 3306,
}));
