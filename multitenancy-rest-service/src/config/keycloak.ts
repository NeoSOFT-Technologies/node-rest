import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
    server: process.env.KEYCLOAK_SERVER || 'http://keycloak:8080/auth'
}));