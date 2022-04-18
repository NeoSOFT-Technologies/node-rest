import { Tenant } from '@app/tenant-reg/entity/tenant.entity';
import { RegistertenantService } from '@app/tenant-reg/registertenant.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Testing RegisTration MicroService Service', () => {
  let registertenantService: RegistertenantService;

  const tenant = {
    tenantName: 'string',
    email: 'string',
    password: 'string',
    description: 'string',
    databaseName: 'string',
    databaseDescription: 'string',
    createdDateTime: 'string',
    clientId: 'string',
    clientSecret: 'string',
  };
  const count = 50;
  const mockTenantRepository = {
    save: jest.fn().mockResolvedValue(tenant),
    findAndCount: jest.fn().mockResolvedValue([[tenant], count]),
    findOneOrFail: jest.fn().mockResolvedValue(tenant),
    update: jest.fn().mockResolvedValue(tenant),
  };
  const mockClient = {
    emit: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistertenantService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: 'Tenant-Master',
          useValue: mockClient,
        },
      ],
    }).compile();

    registertenantService = module.get<RegistertenantService>(
      RegistertenantService,
    );
  });

  it('Testing registerTenant service', async () => {
    const mockMessage = { Message: 'Tenant Registered Successfully' };
    expect(await registertenantService.register(tenant)).toEqual(mockMessage);
  });

  it('Testing getIdSecret', async () => {
    expect(await registertenantService.getIdSecret(tenant.tenantName)).toEqual(
      tenant,
    );
  });

  it('Testing listAll', async () => {
    expect(await registertenantService.listAll()).toEqual([[tenant], count]);
  });

  it('Testing updateDescription', async () => {
    expect(
      await registertenantService.updateDescription(
        tenant.tenantName,
        tenant.description,
      ),
    ).toEqual('Tenant Updated Successfully');
  });

  it('Testing softDelete', async () => {
    expect(await registertenantService.softDelete(tenant.tenantName)).toEqual(
      'Tenant Deleted Successfully',
    );
  });
});
