import { Module } from '@nestjs/common';
import { TenantprovisionController } from './tenantprovision.controller';
import { TenantprovisionService } from './tenantprovision.service';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/../config/.env`,
        `${process.cwd()}/config/.env`,
      ],
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
  ],
  controllers: [TenantprovisionController],
  providers: [TenantprovisionService],
})
export class TenantprovisionModule {}
