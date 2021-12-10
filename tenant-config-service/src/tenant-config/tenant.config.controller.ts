import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { TenantConfigDto } from "./dto/tenant.config.dto";
import { TenantConfigService } from "./tenant.config.service";

@Controller()
export class TenantConfigController{
    constructor(private readonly tenantConfigService: TenantConfigService){}
    // @MessagePattern({ cmd: 'set_config' })
    @EventPattern({cmd: 'set_config'})
    async setConfig(tenantconfig: TenantConfigDto) {
      await this.tenantConfigService.setConfig(tenantconfig);
    }
  
    @MessagePattern({ cmd: 'get_config' })
    async getConfig(tenantId: number) {
      return await this.tenantConfigService.getConfig(tenantId);
    }

}