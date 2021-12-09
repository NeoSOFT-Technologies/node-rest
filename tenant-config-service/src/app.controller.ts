import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TenantConfigDto } from './dto/tenant.config.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('message_printed')
  getConfigTenantService() {
    return 'Tenant config service created';
  }

  @MessagePattern({ cmd: 'set_config' })
  // @EventPattern
  async setConfig(tenantconfig: TenantConfigDto) {
    return await this.appService.setConfig(tenantconfig);
  }

  @MessagePattern({ cmd: 'get_config' })
  async getConfig(tenantId: number) {
    return await this.appService.getConfig(tenantId);
  }
}
