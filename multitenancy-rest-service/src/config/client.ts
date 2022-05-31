import { registerAs } from '@nestjs/config';

export default registerAs('client', () => ({
    id: process.env.CLIENT_ID,
    rootUrl: process.env.ROOT_URL
}));
