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
    listAll: jest.fn(),
    updateDescription: jest.fn(),
    softDelete: jest.fn(),
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

  it('Testing listAllTenant', async () => {
    const mockMessage = { Message: 'All Tenant received Successfully' };
    mockRegistertenantService.listAll.mockResolvedValue(mockMessage);
    expect(await registertenantController.listAllTenant()).toEqual(mockMessage);
  });

  it('Testing updateDescription', async () => {
    const tenantname = 'string';
    const newdescription = 'new description';
    const mockMessage = { Message: 'Tenant Updated Successfully' };
    mockRegistertenantService.updateDescription.mockResolvedValue(mockMessage);
    expect(
      await registertenantController.updateDescription({
        tenantname,
        newdescription,
      }),
    ).toEqual(mockMessage);
  });

  it('Testing softDelete', async () => {
    const tenantname = 'string';
    const mockMessage = { Message: 'Tenant Deleted Successfully' };
    mockRegistertenantService.softDelete.mockResolvedValue(mockMessage);
    expect(await registertenantController.softDelete(tenantname)).toEqual(
      mockMessage,
    );
  });
});
