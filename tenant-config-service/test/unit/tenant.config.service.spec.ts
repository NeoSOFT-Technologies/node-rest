import { TenantConfig } from '@app/tenant-config/entities/tenant.entity';
import { TenantConfigService } from '@app/tenant-config/tenant.config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Testing Config Service', () => {
  let tenantConfigService: TenantConfigService;

  const mockTenantConfigDetails = {
    tenantId: 1234,
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    createdDateTime: 'string',
    host: 'string',
    port: 1234,
  };

  const mockconfigRepository = {
    save: jest.fn().mockResolvedValue('Config saved successfully'),
    findOneOrFail: jest.fn().mockResolvedValue(mockTenantConfigDetails),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantConfigService,
        {
          provide: getRepositoryToken(TenantConfig),
          useValue: mockconfigRepository,
        },
      ],
    }).compile();

    tenantConfigService = module.get<TenantConfigService>(TenantConfigService);
  });

  it('Testing setConfig method of TenantConfigService', async () => {
    expect(
      await tenantConfigService.setConfig(mockTenantConfigDetails),
    ).toEqual('Config saved successfully');
  });

  it('Testing getConfig method of TenantConfigService', async () => {
    expect(await tenantConfigService.getConfig(1234)).toEqual(
      mockTenantConfigDetails,
    );
  });
});
