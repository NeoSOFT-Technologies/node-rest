import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { TenantConfig } from './entities/tenant.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([TenantConfig])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
