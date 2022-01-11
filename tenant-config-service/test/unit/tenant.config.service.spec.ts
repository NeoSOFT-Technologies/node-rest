import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConfig } from '@app/tenant-config/entities/tenant.entity';
import { DatabaseModule } from '@app/tenant-config/db/database.module';
import { TenantConfigService } from '@app/tenant-config/tenant.config.service';
import { ConfigModule } from '@nestjs/config';
import config from '@app/tenant-config/config';
import { TenantConfigController } from '@app/tenant-config/tenant.config.controller';

describe('Testing Config Service', () => {
  const mockTenantConfigDetails = {
    tenantId: 1234,
    tenantName: 'string',
    tenantDbName: 'string',
    description: 'string',
    createdDateTime: 'string',
    host: 'string',
    port: 1234,
  };
  let tenantConfigService: TenantConfigService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([TenantConfig]),
        ConfigModule.forRoot({
          envFilePath: [`${process.cwd()}/config/.env`],
          isGlobal: true,
          expandVariables: true,
          load: config,
        }),
      ],
      controllers: [TenantConfigController],
      providers: [TenantConfigService],
    }).compile();

    tenantConfigService = module.get<TenantConfigService>(TenantConfigService);
  });

  it('Testing setConfig method of TenantConfigService', async () => {
    const mockResponse = expect(
      await tenantConfigService.setConfig(mockTenantConfigDetails),
    ).toEqual({
      id: 1,
      ...mockTenantConfigDetails,
    });
  });

  it('Testing getConfig method of TenantConfigService', async () => {
    expect(await tenantConfigService.getConfig(1234)).toEqual({
      id: 1,
      ...mockTenantConfigDetails,
    });
  });
});
