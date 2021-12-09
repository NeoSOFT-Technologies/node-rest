import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IdentifierService } from './identifier/identifier.service';
import { RegistertenantController } from './registertenant.controller';
import { DatabaseModule } from './db/database.module';
import { RegistertenantService } from './registertenant.service';
import { Tenant } from './entity/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'Tenant-Master',
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8847,
      },
    },
    
  ]), DatabaseModule,
  TypeOrmModule.forFeature([Tenant])
  ],
  controllers: [RegistertenantController],
  providers:[IdentifierService, RegistertenantService]
})
export class RegistertenantModule { }
