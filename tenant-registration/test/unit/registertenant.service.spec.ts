import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from '../../src/tenant-reg/entity/tenant.entity';
import { RegistertenantService } from '../../src/tenant-reg/registertenant.service';

describe('Testing RegisTration MicroService Service', () => {
  let registertenantService: RegistertenantService;

  const tenant = {
    tenantName: 'string',
    email: 'string',
    password: 'string',
    description: 'string',
    createdDateTime: 'string',
  };
  const mockTenantRepository = {
    save: jest.fn().mockResolvedValue(tenant),
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
});
