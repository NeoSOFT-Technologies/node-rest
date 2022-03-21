import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
    server: process.env.KEYCLOAK_SERVER || 'http://keycloak:8080/auth',
    redirectUrl: process.env.KEYCLOAK_REDIRECT_URL || 'http://localhost:8080/auth'
}));