import { INestApplication } from "@nestjs/common";

export function setupCors(app: INestApplication) {
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
};