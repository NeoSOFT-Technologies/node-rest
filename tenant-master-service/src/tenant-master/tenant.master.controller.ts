import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TenantDetailsDto } from "src/dto/tenant.details.dto";
import { TenantMasterService } from "./tenant.master.service";

@Controller()
export class TenantMasterController{
    constructor(private readonly tenantMasterService: TenantMasterService){};

    @MessagePattern({ cmd: 'tenant-master' })
    async masterTenantService(tenantDetails: TenantDetailsDto) {
        try {
          return this.tenantMasterService.masterTenantService(tenantDetails);
        } catch (e) {
          return e
        }
      }
}