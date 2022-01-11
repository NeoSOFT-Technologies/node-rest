import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IdentifierService } from './identifier/identifier.service';
import { RegistertenantController } from './registertenant.controller';
import { DatabaseModule } from './db/database.module';
import { RegistertenantService } from './registertenant.service';
import { Tenant } from './entity/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Tenant-Master',
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: 8847,
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
    DatabaseModule,
    TypeOrmModule.forFeature([Tenant]),
  ],
  controllers: [RegistertenantController],
  providers: [IdentifierService, RegistertenantService],
})
export class RegistertenantModule {}
