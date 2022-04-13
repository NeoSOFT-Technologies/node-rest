import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConfigDto } from './dto/tenant.config.dto';
import { TenantConfig } from './entities/tenant.entity';

@Injectable()
export class TenantConfigService {
  constructor(
    @InjectRepository(TenantConfig)
    private readonly configRepository: Repository<TenantConfig>,
  ) {}

  async setConfig(tenantconfig: TenantConfigDto) {
    return await this.configRepository.save(tenantconfig);
  }

  async getConfig(tenantName: string) {
    try {
      return await this.configRepository.findOneOrFail({
        where: {
          tenantName: tenantName,
        },
      });
    } catch (error) {
      throw new NotFoundException('Incorrect Tenant name entered');
    }
  }

  async updateConfig(tenantname: string, newdescription: string) {
    try {
      const tenant: TenantConfig = await this.configRepository.findOneOrFail({
        where: {
          tenantName: tenantname,
        },
      });
      await this.configRepository.update(tenant.id, {
        ...tenant,
        description: newdescription,
      });
    } catch (e) {
      return e;
    }
  }

  async deleteConfig(tenantname: string) {
    try {
      const tenantEntity = await this.configRepository.findOneOrFail({
        where: {
          tenantName: tenantname,
        },
      });
      await this.configRepository.remove(tenantEntity);
    } catch (e) {
      return e;
    }
  }
}
