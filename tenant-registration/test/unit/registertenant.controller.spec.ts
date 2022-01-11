import { Test, TestingModule } from '@nestjs/testing';
import { IdentifierService } from '@app/tenant-reg/identifier/identifier.service';
import { RegistertenantController } from '@app/tenant-reg/registertenant.controller';
import { RegistertenantService } from '@app/tenant-reg/registertenant.service';

describe('Testing RegisTration MicroService Controller', () => {
  let registertenantController: RegistertenantController;

  const mockMessage = { Message: 'Tenant Registered Successfully' };
  const TenantDetails = {
    email: 'string',
    password: 'string',
    description: 'string',
  };
  const mockRegistertenantService = {
    register: jest.fn().mockResolvedValue(mockMessage),
  };
  const mockIdentifierService = {
    identify: jest.fn().mockResolvedValue(false),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistertenantController],
      providers: [IdentifierService, RegistertenantService],
    })
      .overrideProvider(RegistertenantService)
      .useValue(mockRegistertenantService)
      .overrideProvider(IdentifierService)
      .useValue(mockIdentifierService)
      .compile();

    registertenantController = module.get<RegistertenantController>(
      RegistertenantController,
    );
  });

  it('Testing registerTenantcontroller registerTenant', async () => {
    expect(
      await registertenantController.registerTenant(TenantDetails),
    ).toEqual(mockMessage);
  });
});
