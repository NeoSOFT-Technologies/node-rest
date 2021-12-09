import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entity/tenant.entity';

@Module({
    imports: [
        // TypeOrmModule.forRoot({
        //     type: 'mysql',
        //     host: 'localhost',
        //     port: 3306,
        //     username: 'root',
        //     password: 'root',
        //     database: 'registered_tenant',
        //     entities: [Tenant],
        //     // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //     synchronize: false,

        // }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'rest_api',
                entities: [Tenant],
                // entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
        }),
    ]
})
export class DatabaseModule { }
