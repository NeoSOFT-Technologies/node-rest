import { Module } from '@nestjs/common';
import { TenantprovisionController } from './tenantprovision.controller';
import { TenantprovisionService } from './tenantprovision.service';

@Module({
  controllers: [TenantprovisionController],
  providers: [TenantprovisionService]
})
export class TenantprovisionModule {}
