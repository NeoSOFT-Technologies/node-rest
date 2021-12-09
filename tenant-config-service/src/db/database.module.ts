import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenantConfig } from "src/entities/tenant.entity";

@Module({
    imports:[TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database:'rest_api',
        entities:[TenantConfig],
        synchronize: true,
    })],
})
export class DatabaseModule{}