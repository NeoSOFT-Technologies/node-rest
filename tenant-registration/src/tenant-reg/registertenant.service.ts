import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { TenantDetailsDto } from './dto/tenant.details.dto';
import { Tenant } from './entity/tenant.entity';

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
    const date = new Date();
    tenant.createdDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
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

    this.client.emit({ cmd: 'tenant-master' }, tenantDetails);
    return { Message: 'Tenant Registered Successfully' };
  }

  async getIdSecret(tenantName: string): Promise<Tenant> {
    try {
      return await this.tenantRepository.findOneOrFail({
        where: {
          tenantName,
        },
      });
    } catch (error) {
      throw new NotFoundException('Tenant not found');
    }
  }

  listAll(
    tenantName = '',
    isDeleted = '',
    page = 1,
  ): Promise<[Tenant[], number]> {
    if ((isDeleted = '')) {
      return this.tenantRepository.findAndCount({
        where: {
          tenantName: Like(`%${tenantName}%`),
        },
        take: 10,
        skip: 10 * (page - 1),
      });
    } else {
      return this.tenantRepository.findAndCount({
        where: {
          tenantName: Like(`%${tenantName}%`),
          isDelete: isDeleted === 'true',
        },
        take: 10,
        skip: 10 * (page - 1),
      });
    }
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
        isDelete: false,
      },
    });

    await this.tenantRepository.update(tenant.id, {
      ...tenant,
      isDelete: true,
    });
    return 'Tenant Deleted Successfully';
  }
}
