import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
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
  async getConfig(tenantName: string) {
    try {
      return await this.tenantConfigService.getConfig(tenantName);
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @EventPattern({ cmd: 'update-config' })
  async updateConfig({ tenantname, newdescription }) {
    try {
      await this.tenantConfigService.updateConfig(tenantname, newdescription);
    } catch (e) {
      return e;
    }
  }

  @EventPattern({ cmd: 'delete-config' })
  async deleteConfig(tenantname: string) {
    try {
      await this.tenantConfigService.deleteConfig(tenantname);
    } catch (e) {
      return e;
    }
  }
}
