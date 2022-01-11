import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TenantConfigDto } from './dto/tenant.config.dto';
import { TenantConfigService } from './tenant.config.service';

@Controller()
export class TenantConfigController {
  constructor(private readonly tenantConfigService: TenantConfigService) {}
  @EventPattern({ cmd: 'set_config' })
  async setConfig(tenantconfig: TenantConfigDto) {
    try {
      await this.tenantConfigService.setConfig(tenantconfig);
    } catch (e) {
      return e;
    }
  }

  @MessagePattern({ cmd: 'get_config' })
  async getConfig(tenantId: number) {
    try {
      return await this.tenantConfigService.getConfig(tenantId);
    } catch (e) {
      return e;
    }
  }
}
