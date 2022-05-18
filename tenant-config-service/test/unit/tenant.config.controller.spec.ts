import { Test, TestingModule } from '@nestjs/testing';
import { TenantConfigController } from '@app/tenant-config/tenant.config.controller';
import { TenantConfigService } from '@app/tenant-config/tenant.config.service';

describe('Testing Tenant Config Controller', () => {
  let tenantConfigController: TenantConfigController;
  let tenantConfigService: TenantConfigService;
  const mockMessage = { Message: 'Tenant Config set successfully' };
  const mockDeleteMessage = { Message: 'Delete Tenant successfully' };
  const mockTenantName = 'string';
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
    deleteConfig: jest.fn().mockResolvedValue(mockDeleteMessage),
    updateConfig: jest.fn(),
  };

  const tenantConfig = {
    tenantId: 1,
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    databaseName: 'string',
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
    expect(await tenantConfigController.getConfig(mockTenantName)).toEqual(
      mockTenantDetails,
    );
  });

  it('Testing updateConfig from Tenant Config Controller', async () => {
    const tenantname = 'tenantName';
    const newdescription = 'new Description';
    await tenantConfigController.updateConfig({ tenantname, newdescription });
    expect(tenantConfigService.updateConfig).toHaveBeenCalledWith(
      tenantname,
      newdescription,
    );
  });

  it('Testing deleteConfig from Tenant Config Controller', async () => {
    await tenantConfigController.deleteConfig(mockTenantName);
    expect(tenantConfigService.deleteConfig).toHaveBeenCalledWith(
      mockTenantName,
    );
  });
});
