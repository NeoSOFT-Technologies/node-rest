import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProvisionTenantDto } from './dto/provision.tenant.dto';
import { ProvisionTenantTableDto } from './dto/provision.tenant.table.dto';
import { SeedingDataeDto } from './dto/seeding-data.dto';
import { TenantprovisionService } from './tenantprovision.service';

@Controller('tenantprovision')
export class TenantprovisionController {
    constructor(private readonly provisionService: TenantprovisionService) { }

    @MessagePattern({ cmd: 'create-database' })
    async createDatabase(tenant_name: ProvisionTenantDto) {
        try {
            return await this.provisionService.createDatabase(tenant_name)
        } catch (e) {
            return e;
        }
    }

    @MessagePattern({ cmd: 'create-table' })
    async createTable(table_details: ProvisionTenantTableDto) {
        try {
            return await this.provisionService.createTable(table_details);
        } catch (e) {
            return e;
        }
    }

    @MessagePattern({ cmd: 'seed' })
    async seedData(data: SeedingDataeDto) {
        try {
            return await this.provisionService.seed(data);
        } catch (e) {
            return e;
        }
    }
    
    @MessagePattern({ cmd: 'ping' })
    async ping(tenantData: ProvisionTenantDto) {
        try {
            return await this.provisionService.ping(tenantData);
        } catch (e) {
            return e;
        }
    }
}
