import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { TenantDetailsDto } from './dto/tenant.details.dto';
import { Tenant } from './entity/tenant.entity';
import { encodePassword } from './utils/bcrypt';

@Injectable()
export class RegistertenantService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @Inject('Tenant-Master') private readonly client: ClientProxy,
  ) {
    this.logger = new Logger('Register Tenant Service');
  }
  async register(tenant: RegisterTenantDto) {
    if (!tenant.tenantName) {
      tenant.tenantName =
        tenant.email.split('@')[0] +
        '-' +
        Date.now().toString(36).slice(-4) +
        '-' +
        Math.random().toString(16).slice(-4);
    }
    const password = tenant.password;
    tenant.password = encodePassword(tenant.password);
    const date = new Date();
    tenant.createdDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, '/')
      .replace('T', ' ');

    this.logger.log('Inserting tenant data in tenant table ...');
    const registeredTenant = await this.tenantRepository.save(tenant);
    this.logger.log('Inserted successfully !!');
    const tenantDetails: TenantDetailsDto = {
      tenantId: registeredTenant.id,
      tenantName: registeredTenant.tenantName,
      databaseName: registeredTenant.databaseName,
      password: password,
      description: registeredTenant.description,
      createdDateTime: registeredTenant.createdDateTime,
    };
    this.client.emit({ cmd: 'tenant-master' }, tenantDetails);
    return { Message: 'Tenant Registered Successfully' };
  }

  async getIdSecret(tenantName: string): Promise<Tenant> {
    try {
      return await this.tenantRepository.findOneOrFail({
        where: {
          tenantName,
          isDeleted: false,
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
    if (isDeleted === '') {
      return this.tenantRepository.findAndCount({
        select: [
          'id',
          'tenantName',
          'email',
          'description',
          'databaseName',
          'databaseDescription',
          'createdDateTime',
        ],
        where: {
          tenantName: Like(`%${tenantName}%`),
        },
        take: 10,
        skip: 10 * (page - 1),
      });
    } else {
      return this.tenantRepository.findAndCount({
        select: [
          'id',
          'tenantName',
          'email',
          'description',
          'databaseName',
          'databaseDescription',
          'createdDateTime',
        ],
        where: {
          tenantName: Like(`%${tenantName}%`),
          isDeleted: isDeleted === 'true',
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
        isDeleted: false,
      },
    });

    await this.tenantRepository.update(tenant.id, {
      ...tenant,
      description: newdescription,
    });
    return 'Tenant Updated Successfully';
  }

  async softDelete(tenantname: string) {
    const tenant: Tenant = await this.tenantRepository.findOneOrFail({
      where: {
        tenantName: tenantname,
        isDeleted: false,
      },
    });

    await this.tenantRepository.update(tenant.id, {
      ...tenant,
      isDeleted: true,
    });
    return 'Tenant Deleted Successfully';
  }
}
