import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { TenantDetailsDto } from './dto/tenant.details.dto';

@Injectable()
export class TenantMasterService {
  constructor(
    @Inject('TENANT_PROVISION_SERVICE') private readonly client1: ClientProxy,
    @Inject('TENANT_CONFIG_SERVICE') private readonly client2: ClientProxy,
    private config: ConfigService,
  ) {}
  async masterTenantService(tenantDetails: TenantDetailsDto) {
    const tenant = {
      tenantName: tenantDetails.tenantName,
      password: tenantDetails.password,
      databaseName: tenantDetails.databaseName,
    };
    const message = this.client1.send({ cmd: 'create-database' }, tenant);
    const databaseName: string = await new Promise((res) => {
      message.subscribe((next) => {
        res(next.database_name);
      });
    });
    const Tenantconfig: TenantDetailsDto = {
      ...tenantDetails,
      databaseName,
      host: this.config.get('db.host'),
      port: this.config.get('db.port'),
    };
    this.client2.emit({ cmd: 'set_config' }, Tenantconfig);
  }
}
