import { Test, TestingModule } from '@nestjs/testing';
import { TenantprovisionController } from '@app/tenant-provisioning/tenantprovision.controller';
import { TenantprovisionService } from '@app/tenant-provisioning/tenantprovision.service';
import { TenantprovisionModule } from '@app/tenant-provisioning/tenantprovision.module';

describe('Testing Provisioning MicroService Controller', () => {
  let tenantprovisionController: TenantprovisionController;

  const mockTenantprovisionService = {
    createDatabase: jest.fn().mockResolvedValue({
      Message: 'Tenant Database Provisoned successfully',
    }),
    createTable: jest
      .fn()
      .mockResolvedValue({ Message: 'Table created successfully' }),
    seed: jest.fn().mockResolvedValue({ Message: 'Data seeded successfully' }),
    ping: jest.fn().mockResolvedValue({ Message: 'Ping successfully' }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TenantprovisionModule],
      controllers: [TenantprovisionController],
      providers: [TenantprovisionService],
    })
      .overrideProvider(TenantprovisionService)
      .useValue(mockTenantprovisionService)
      .compile();

    tenantprovisionController = module.get<TenantprovisionController>(
      TenantprovisionController,
    );
  });

  it('Testing tenantprovisionController createDatabase', async () => {
    const Tenant = {
      tenantName: 'string',
      password: 'string',
      databaseName: 'string',
    };
    expect(await tenantprovisionController.createDatabase(Tenant)).toEqual({
      Message: 'Tenant Database Provisoned successfully',
    });
  });

  it('Testing tenantprovisionController createTable', async () => {
    const provisionTenantTable = {
      dbName: 'string',
      tableName: 'string',
      columns: [
        {
          columnName: 'string',
          columntype: 'any',
        },
      ],
    };

    expect(
      await tenantprovisionController.createTable(provisionTenantTable),
    ).toEqual({
      Message: 'Table created successfully',
    });
  });

  it('Testing tenantprovisionController seedData', async () => {
    const SeedingData = {
      dbName: 'string',
      tableName: 'string',
      columnNames: ['string'],
      values: ['any'],
    };

    expect(await tenantprovisionController.seedData(SeedingData)).toEqual({
      Message: 'Data seeded successfully',
    });
  });

  it('Testing tenantprovisionController ping', async () => {
    const TenantName = {
      tenantName: 'string',
      password: 'string',
      databaseName: 'string',
    };

    expect(await tenantprovisionController.ping(TenantName)).toEqual({
      Message: 'Ping successfully',
    });
  });
});
