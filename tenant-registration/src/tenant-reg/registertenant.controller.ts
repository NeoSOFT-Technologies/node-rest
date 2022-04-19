import { ConflictException, Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { IdentifierService } from './identifier/identifier.service';
import { RegistertenantService } from './registertenant.service';

@Controller('registertenant')
export class RegistertenantController {
  constructor(
    private readonly tenantService: RegistertenantService,
    private readonly identifierService: IdentifierService,
  ) {}

  @MessagePattern({ cmd: 'register-tenant' })
  async registerTenant(tenant: RegisterTenantDto) {
    try {
      if (await this.identifierService.identify(tenant)) {
        return {
          status: 'This tenant already exists',
        };
      }
      return await this.tenantService.register(tenant);
    } catch (e) {
      return e;
    }
  }

  @MessagePattern({ cmd: 'check-dbName' })
  async checkDbName(dbName: string) {
    try {
      if (await this.identifierService.checkDb(dbName)) {
        throw new ConflictException('Database name already taken');
      }
      return true;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern({ cmd: 'get-client-id-secret' })
  async getClientIdSecret(tenantName: string) {
    try {
      return await this.tenantService.getIdSecret(tenantName);
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern({ cmd: 'list-all-tenant' })
  async listAllTenant({ tenantName, isDeleted, page }) {
    try {
      return await this.tenantService.listAll(tenantName, isDeleted, page);
    } catch (e) {
      return e;
    }
  }

  @MessagePattern({ cmd: 'update-description' })
  async updateDescription({ tenantname, newdescription }) {
    try {
      return await this.tenantService.updateDescription(
        tenantname,
        newdescription,
      );
    } catch (e) {
      return e;
    }
  }

  @MessagePattern({ cmd: 'soft-delete' })
  async softDelete(tenantname: string) {
    try {
      return await this.tenantService.softDelete(tenantname);
    } catch (e) {
      return e;
    }
  }
}
