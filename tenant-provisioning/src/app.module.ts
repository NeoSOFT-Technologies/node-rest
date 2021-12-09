import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantprovisionModule } from './tenant-provisioning/tenantprovision.module';

@Module({
  imports: [TenantprovisionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
