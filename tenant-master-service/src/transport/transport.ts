import { Transport } from "@nestjs/microservices";

export const transportOptions = {
    transport: Transport.TCP,
    options: {
        host: '127.0.0.1',
        port: 8847
    }
}