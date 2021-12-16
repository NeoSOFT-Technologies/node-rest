import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TenantConfig } from "../entities/tenant.entity";

@Module({
    imports:[TypeOrmModule.forRootAsync({
        // type: 'mysql',
        // host: 'localhost',
        // port: 3306,
        // username: 'root',
        // password: 'root',
        // database:'rest_api',
        // entities:[TenantConfig],
        // synchronize: true,
        imports:[ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            type: 'mysql',
            host: config.get('db.host'),
            port: config.get('db.port'),
            username: config.get('db.username'),
            password: config.get('db.password'),
            database: config.get('db.database'),
            entities: [TenantConfig],
            synchronize: true,
        }),
    })],
})
export class DatabaseModule{}