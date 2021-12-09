import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TENANT_CONFIG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8848
        }
      },
      {
        name: 'TENANT_PROVISION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8878
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
