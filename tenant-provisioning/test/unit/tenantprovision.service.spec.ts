import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from '@app/tenant-provisioning/config';
import { TenantprovisionService } from '@app/tenant-provisioning/tenantprovision.service';

jest.mock('@app/tenant-provisioning/connection.utils', () => {
  return {
    ConnectionUtils: {
      getConnection: jest.fn(() => ({
        query: jest
          .fn()
          .mockImplementationOnce((arg1, arg2, cb) => {
            cb(null, ['Tenant-Database', 'Tenant-Table']);
          })
          .mockImplementation((arg1, arg2, cb) => {
            cb();
          }),
      })),
      endConnection: jest.fn(),
    },
  };
});

describe('Testing Provisioning MicroService Service', () => {
  let tenantprovisionService: TenantprovisionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [`${process.cwd()}/config/.env`],
          isGlobal: true,
          expandVariables: true,
          load: config,
        }),
      ],
      providers: [TenantprovisionService],
    }).compile();

    tenantprovisionService = module.get<TenantprovisionService>(
      TenantprovisionService,
    );
  });

  it('Testing tenantprovisionService ping', async () => {
    const TenantName = {
      tenantName: 'string',
      password: process.env.TEST_PASSWORD,
      databaseName: 'string',
    };

    expect(await tenantprovisionService.ping(TenantName)).toEqual({
      'Tenant-Database': 'Tenant-Database',
      'Tenant-Table': 'Tenant-Table',
    });
  });

  it('Testing tenantprovisionService createDatabase', async () => {
    const TenantName = {
      tenantName: 'string',
      password: process.env.TEST_PASSWORD,
      databaseName: 'db-string',
    };
    expect(
      (await tenantprovisionService.createDatabase(TenantName)).status,
    ).toEqual('Database created successfully');
  });

  it('Testing tenantprovisionService createTable', async () => {
    const provisionTenantTable = {
      dbName: 'db-string',
      tableName: 'string',
      columns: [
        {
          columnName: 'string',
          columntype: 'int',
        },
      ],
    };

    expect(
      (await tenantprovisionService.createTable(provisionTenantTable)).status,
    ).toEqual('Table created successfully');
  });

  it('Testing tenantprovisionService seed', async () => {
    const SeedingData = {
      dbName: 'db-string',
      tableName: 'string',
      columnNames: ['string'],
      values: ['any'],
    };

    expect((await tenantprovisionService.seed(SeedingData)).status).toEqual(
      'Data seeded successfully',
    );
  });
});
