import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import config from './config';
import { Keycloak } from './iam/keycloak';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/config/.env`],
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    ClientsModule.register([
      {
        name: 'REGISTER_TENANT',
        transport: Transport.TCP,
        options: {
          host: process.env.TENANT_REGISTRATION_HOST,
          port: 8875,
        },
      },
      {
        name: 'GET_TENANT_CONFIG',
        transport: Transport.TCP,
        options: {
          host: process.env.TENANT_CONFIG_HOST,
          port: 8848,
        },
      },
      {
        name: 'CREATE_TABLE',
        transport: Transport.TCP,
        options: {
          host: process.env.TENANT_PROVISIONING_HOST,
          port: 8878,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, Keycloak, AuthService, KeycloakAuthGuard],
})
export class AppModule {}
