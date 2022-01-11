import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantConfigModule } from './tenant-config/tenant.config.module';

@Module({
  imports: [TenantConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
