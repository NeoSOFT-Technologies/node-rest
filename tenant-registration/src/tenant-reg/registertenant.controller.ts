import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { IdentifierService } from './identifier/identifier.service';
import { RegistertenantService } from './registertenant.service';

@Controller('registertenant')
export class RegistertenantController {
  constructor(private readonly tenantService: RegistertenantService, private readonly identifierService: IdentifierService) { }

  @MessagePattern({ cmd: 'register-tenant' })
  async registerTenant(tenant: RegisterTenantDto) {
    try {
      if (await this.identifierService.identify(tenant)) {
        return {
          'status': 'this tenant already exists'
        }
      }
      return await this.tenantService.register(tenant);
    } catch (e) {
      return e;
    }
  }
}
