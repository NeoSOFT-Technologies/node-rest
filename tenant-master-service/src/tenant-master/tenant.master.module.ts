import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TenantMasterController } from './tenant.master.controller';
import { TenantMasterService } from './tenant.master.service';
import config from './config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TENANT_CONFIG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT2_HOST,
          port: 8848,
        },
      },
      {
        name: 'TENANT_PROVISION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT1_HOST,
          port: 8878,
        },
      },
    ]),
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
  controllers: [TenantMasterController],
  providers: [TenantMasterService],
})
export class TenantMasterModule {}
