import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentifyTenantDto } from '../dto/identify.tenant.dto';
import { Tenant } from '../entity/tenant.entity';

@Injectable()
export class IdentifierService {
    constructor(
        @InjectRepository(Tenant) private readonly tenantRepository: Repository<Tenant>,
    ) { }

    async identify(tenant: IdentifyTenantDto):Promise<number> {
            return this.tenantRepository.count({
            where:{
                tenantName: tenant.tenantName,
                email: tenant.email
            }
        });
    }
}
