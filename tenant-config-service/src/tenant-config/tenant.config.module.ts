import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './db/database.module';
import { TenantConfig } from './entities/tenant.entity';
import { TenantConfigController } from "./tenant.config.controller";
import { TenantConfigService } from "./tenant.config.service";
import { ConfigModule } from '@nestjs/config';
import config from '../config';

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([TenantConfig]),  ConfigModule.forRoot({
        envFilePath: [`${process.cwd()}/../config/.env`],
        isGlobal: true,
        expandVariables: true,
        load: config,
      }),],
    controllers: [TenantConfigController],
    providers: [TenantConfigService]
})
export class TenantConfigModule {}