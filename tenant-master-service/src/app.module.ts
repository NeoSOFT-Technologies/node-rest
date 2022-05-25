import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMasterModule } from './tenant-master/tenant.master.module';

@Module({
  imports: [TenantMasterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
