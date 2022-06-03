import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
    server: process.env.KEYCLOAK_SERVER || 'https://keycloak:8080/auth',
    key: process.env.KEY
}));
