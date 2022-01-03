import { Test, TestingModule } from '@nestjs/testing';
import { TenantMasterController } from '@app/tenant-master/tenant.master.controller';
import { TenantMasterService } from '@app/tenant-master/tenant.master.service';

describe('Tenant Master Controller', () => {
  let tenantMasterController: TenantMasterController;
  let tenantMasterService: TenantMasterService;
  const mocktenantDetails = {
    tenantId: 'string',
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    createdDateTime: 'string',
    host: 'string',
    port: 123,
  };
  const mockTenantMasterService = {
    masterTenantService: jest.fn().mockResolvedValue(mocktenantDetails),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantMasterController],
      providers: [TenantMasterService],
    })
      .overrideProvider(TenantMasterService)
      .useValue(mockTenantMasterService)
      .compile();

    tenantMasterController = module.get<TenantMasterController>(
      TenantMasterController,
    );

    tenantMasterService = module.get<TenantMasterService>(TenantMasterService);
  });

  it('Testing masterTenantService of Tenant Master Controller', async () => {
    await tenantMasterController.masterTenantService(mocktenantDetails);
    expect(tenantMasterService.masterTenantService).toHaveBeenCalledWith(
      mocktenantDetails,
    );
  });
});
