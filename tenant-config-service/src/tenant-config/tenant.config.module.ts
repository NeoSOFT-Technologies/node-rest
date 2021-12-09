import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/db/database.module';
import { TenantConfig } from 'src/entities/tenant.entity';
import { TenantConfigController } from "./tenant.config.controller";
import { TenantConfigService } from "./tenant.config.service";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([TenantConfig])],
    controllers: [TenantConfigController],
    providers: [TenantConfigService]
})
export class TenantConfigModule {}