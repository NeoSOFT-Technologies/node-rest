import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TenantDetailsDto } from './dto/tenant.details.dto';

@Injectable()
export class AppService {
  constructor(@Inject('TENANT_PROVISION_SERVICE') private readonly client1: ClientProxy,
    @Inject('TENANT_CONFIG_SERVICE') private readonly client2: ClientProxy,
  ) { }

  async masterTenantService(tenantDetails: TenantDetailsDto) {
    const tenant_name = {
      tenantName: tenantDetails.tenantName
    }

    const message = this.client1.send({ cmd: 'create-database' }, tenant_name);
    const databaseName: string = await new Promise((res, rej) => {
      message.subscribe((next) => {
        res(next.database_name);
      });
    })

    const Tenantconfig: TenantDetailsDto = {
      ...tenantDetails,
      tenantDbName: databaseName,
      host: '127.0.0.1',
      port: 3306
    }
    return this.client2.send({ cmd: 'set_config' }, Tenantconfig);
  }
}
