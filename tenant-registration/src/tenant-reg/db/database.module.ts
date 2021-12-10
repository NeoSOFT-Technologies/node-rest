import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entity/tenant.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('db.host'),
                port: config.get('db.port'),
                username: config.get('db.username'),
                password: config.get('db.password'),
                database: config.get('db.database'),
                entities: [Tenant],
                synchronize: true,
            }),
        }),
    ]
})
export class DatabaseModule { }
