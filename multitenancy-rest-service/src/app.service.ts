import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterTenantDto } from './dto/register.tenant.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('REGISTER_TENANT') private readonly client1: ClientProxy,
    @Inject('GET_TENANT_CONFIG') private readonly client2: ClientProxy,
  ) { }
  register(tenant: RegisterTenantDto) {
    return this.client1.send({ cmd: 'register-tenant' }, tenant);
  }
  getTenantConfig(id: number) {
    return this.client2.send({ cmd: 'get_config' }, id);
  }
  listAllTenant() {
    return this.client1.send({ cmd: 'list-all-tenant' }, '');
  }
  updateDescription(tenantname: string, newdescription: string) {
    return this.client1.send({ cmd: 'update-description' }, { tenantname, newdescription });
  }
  deleteTenant(tenantname: string) {
    return this.client1.send({ cmd: 'soft-delete' }, tenantname);
  }
}
