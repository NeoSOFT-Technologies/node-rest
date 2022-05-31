import { registerAs } from '@nestjs/config';

export default registerAs('mailServer', () => ({
    host: process.env.MAIL_SERVER_HOST || "demo-mail-server",
    port: +process.env.MAIL_SERVER_PORT || 1025
}));
