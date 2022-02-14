import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { throwError } from 'rxjs';
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
      const isIntegerValue = Number.isInteger(tenantId);
      if (!isIntegerValue) {
        throw new Error('Wrong Integer Entered');
      }
      return await this.tenantConfigService.getConfig(tenantId);
    } catch (e) {
      return throwError(() => e);
    }
  }
}
