import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantConfigDto } from './dto/tenant.config.dto';
import { TenantConfig } from './entities/tenant.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(TenantConfig) private readonly configRepository: Repository<TenantConfig>) { }

  async setConfig(tenantconfig: TenantConfigDto) {
    return await this.configRepository.save(tenantconfig);
  }

  async getConfig(tenantId: number) {
    return await this.configRepository.findOneOrFail({
      where: {
        tenantId: tenantId,
      }
    });
  }
}
