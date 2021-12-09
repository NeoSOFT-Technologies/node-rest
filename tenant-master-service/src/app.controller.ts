import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern, EventPattern } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { TenantDetailsDto } from './dto/tenant.details.dto';

@Controller()
export class AppController {
  constructor(@Inject('TENANT_CONFIG_SERVICE') private readonly client: ClientProxy, private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'tenant-master' })
  async masterTenantService(tenantDetails: TenantDetailsDto) {
    try {
      return this.appService.masterTenantService(tenantDetails);
    } catch (e) {
      return e
    }
  }
}
