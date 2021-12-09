import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TenantConfigDto } from "src/dto/tenant.config.dto";
import { TenantConfig } from "src/entities/tenant.entity";
import { Repository } from "typeorm";

@Injectable()
export class TenantConfigService{
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