import { registerAs } from '@nestjs/config';

export default registerAs('client', () => ({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
}));