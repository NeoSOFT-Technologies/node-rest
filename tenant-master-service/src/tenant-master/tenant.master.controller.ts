import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TenantDetailsDto } from './dto/tenant.details.dto';
import { TenantMasterService } from './tenant.master.service';

@Controller()
export class TenantMasterController {
  constructor(private readonly tenantMasterService: TenantMasterService) {}

  @EventPattern({ cmd: 'tenant-master' })
  async masterTenantService(tenantDetails: TenantDetailsDto) {
    try {
      await this.tenantMasterService.masterTenantService(tenantDetails);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
