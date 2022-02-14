import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
    user: process.env.KEYCLOAK_ADMIN_USER || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    server: process.env.KEYCLOAK_SERVER || 'http://keycloak:8080/auth'
}));