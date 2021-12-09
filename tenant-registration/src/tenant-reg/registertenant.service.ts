import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { TenantDetailsDto } from './dto/tenant.details.dto';
import { Tenant } from './entity/tenant.entity';

@Injectable()
export class RegistertenantService {
    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepository: Repository<Tenant>,
        @Inject('Tenant-Master') private readonly client: ClientProxy
    ) { }
    async register(tenant: RegisterTenantDto) {
        tenant.tenantName = tenant.email.split('@')[0] + '-' +
            Date.now().toString(36).slice(-4) + '-' +
            Math.random().toString(16).slice(-4);

        tenant.createdDateTime = (new Date()).toISOString()
            .slice(0, 19)
            .replace(/-/g, "/")
            .replace("T", " ");


        const registered_tenant = await this.tenantRepository.save(tenant);

        const tenantDetails: TenantDetailsDto = {
            tenantId: registered_tenant.id,
            tenantName: registered_tenant.tenantName,
            description: registered_tenant.description,
            createdDateTime: registered_tenant.createdDateTime,
        }

        return this.client.send({ cmd: 'tenant-master' }, tenantDetails);
    }
}
