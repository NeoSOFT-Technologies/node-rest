import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TenantMasterService } from '@app/tenant-master/tenant.master.service';

describe('Testing Tenant Master Service', () => {
  let tenantMasterService: TenantMasterService;
  const mockClient1 = {
    send: jest.fn().mockImplementation(() => {
      return of({
        status: 'Database created successfully',
        database_name: 'db-string',
      });
    }),
  };
  const mockClient2 = {
    emit: jest.fn(),
  };
  const mockTenantDetails = {
    tenantId: 'string',
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    createdDateTime: 'string',
    host: 'string',
    port: 1234,
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantMasterService,
        {
          provide: 'TENANT_PROVISION_SERVICE',
          useValue: mockClient1,
        },
        {
          provide: 'TENANT_CONFIG_SERVICE',
          useValue: mockClient2,
        },
      ],
    }).compile();

    tenantMasterService = module.get<TenantMasterService>(TenantMasterService);
  });

  describe('Testing masterTenantService method', () => {
    beforeAll(async () => {
      await tenantMasterService.masterTenantService(mockTenantDetails);
    });
    it('Testing createDatabase for tenant', async () => {
      const provisioningDatabase = jest.spyOn(mockClient1, 'send');
      expect(provisioningDatabase).toHaveBeenCalled();
    });
    it('Testing setConfig of the tenant', async () => {
      const settingConfig = jest.spyOn(mockClient2, 'emit');
      expect(settingConfig).toHaveBeenCalled();
    });
  });
});
