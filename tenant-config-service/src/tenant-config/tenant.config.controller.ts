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
  async getConfig(tenantId: number) {
    try {
      const isIntegerValue = Number.isInteger(tenantId);
      if (!isIntegerValue) {
        throw new HttpException(
          'Please enter an integer value',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      return await this.tenantConfigService.getConfig(tenantId);
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
