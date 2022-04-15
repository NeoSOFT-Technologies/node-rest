import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { TenantDetailsDto } from './dto/tenant.details.dto';
import { Tenant } from './entity/tenant.entity';
import { encodePassword } from './utils/bcrypt';


@Injectable()
export class RegistertenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @Inject('Tenant-Master') private readonly client: ClientProxy,
  ) {}
  async register(tenant: RegisterTenantDto) {
    if (!tenant.tenantName) {
      tenant.tenantName =
        tenant.email.split('@')[0] +
        '-' +
        Date.now().toString(36).slice(-4) +
        '-' +
        Math.random().toString(16).slice(-4);
    }

    const password = encodePassword(tenant.password);
    tenant.password = password;

    tenant.createdDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, '/')
      .replace('T', ' ');

    const registered_tenant = await this.tenantRepository.save(tenant);

    const tenantDetails: TenantDetailsDto = {
      tenantId: registered_tenant.id,
      tenantName: registered_tenant.tenantName,
      password: registered_tenant.password,
      description: registered_tenant.description,
      createdDateTime: registered_tenant.createdDateTime,
    };
    console.log(`password:${tenant.password}`);

    this.client.emit({ cmd: 'tenant-master' }, tenantDetails);
    return { Message: 'Tenant Registered Successfully' };
  }

  listAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async updateDescription(tenantname: string, newdescription: string) {
    const tenant: Tenant = await this.tenantRepository.findOneOrFail({
      where: {
        tenantName: tenantname,
      },
    });

    return this.tenantRepository.update(tenant.id, {
      ...tenant,
      description: newdescription,
    });
  }

  async softDelete(tenantname: string) {
    const tenant: Tenant = await this.tenantRepository.findOneOrFail({
      where: {
        tenantName: tenantname,
      },
    });

    return this.tenantRepository.update(tenant.id, {
      ...tenant,
      isDelete: true,
    });
  }
}
