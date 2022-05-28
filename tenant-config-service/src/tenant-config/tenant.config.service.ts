import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConfigDto } from './dto/tenant.config.dto';
import { TenantConfig } from './entities/tenant.entity';

@Injectable()
export class TenantConfigService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(TenantConfig)
    private readonly configRepository: Repository<TenantConfig>,
  ) {
    this.logger = new Logger('Tenant Config Service');
  }

  async setConfig(tenantconfig: TenantConfigDto) {
    try {
      return await this.configRepository.save(tenantconfig);
    } catch (error) {
      this.logger.error(`Error while setting config: ${error}`);
      throw error;
    }
  }

  async getConfig(tenantName: string) {
    try {
      return await this.configRepository.findOneOrFail({
        where: {
          tenantName: tenantName,
        },
      });
    } catch (error) {
      this.logger.error('Incorrect Tenant name entered');
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
      return 'Updated successfully';
    } catch (e) {
      this.logger.error('Tenant not found');
      throw new NotFoundException('Tenant not found');
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
      return 'Deletion Successfull';
    } catch (error) {
      this.logger.error(`Error while deleting config: ${error}`);
      throw error;
    }
  }
}
