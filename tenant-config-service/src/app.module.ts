import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { TenantConfigModule } from './tenant-config/tenant.config.module';

@Module({
  imports: [TenantConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
