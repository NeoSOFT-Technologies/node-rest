import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../src/tenant-config/db/database.module';
import { TenantConfigController } from '../../src/tenant-config/tenant.config.controller';
import { TenantConfigModule } from '../../src/tenant-config/tenant.config.module';
import { TenantConfigService } from '../../src/tenant-config/tenant.config.service';

describe('Testing Tenant Config Controller', () => {
  let tenantConfigController: TenantConfigController;
  let tenantConfigService: TenantConfigService;
  const mockMessage = { Message: 'Tenant Config set successfully' };
  const mockId = 1;
  const mockTenantDetails = {
    id: 1,
    tenant_id: 1,
    tenant_name: 'string',
    description: 'string',
    createdDateTime: 'string',
    tenantDbName: 'string',
    host: 'string',
    port: 1,
  };

  const mockTenantConfigService = {
    setConfig: jest.fn().mockResolvedValue(mockMessage),
    getConfig: jest.fn().mockResolvedValue(mockTenantDetails),
  };

  const tenantConfig = {
    tenantId: 1,
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    createdDateTime: 'string',
    host: 'string',
    port: 3306,
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantConfigController],
      providers: [TenantConfigService],
    })
      .overrideProvider(TenantConfigService)
      .useValue(mockTenantConfigService)
      .compile();
    tenantConfigController = module.get<TenantConfigController>(
      TenantConfigController,
    );
    tenantConfigService = module.get<TenantConfigService>(TenantConfigService);
  });

  it('Testing setConfig from Tenant Config Controller', async () => {
    await tenantConfigController.setConfig(tenantConfig);
    expect(tenantConfigService.setConfig).toHaveBeenCalledWith(tenantConfig);
  });

  it('Testing getConfig from Tenant Config Controller', async () => {
    expect(await tenantConfigController.getConfig(mockId)).toEqual(
      mockTenantDetails,
    );
  });
});
