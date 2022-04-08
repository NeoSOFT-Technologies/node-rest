import { IdentifierService } from '@app/tenant-reg/identifier/identifier.service';
import { RegistertenantController } from '@app/tenant-reg/registertenant.controller';
import { RegistertenantService } from '@app/tenant-reg/registertenant.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Testing RegisTration MicroService Controller', () => {
  let registertenantController: RegistertenantController;

  const TenantDetails = {
    tenantName: 'string',
    email: 'string',
    password: 'string',
    description: 'string',
    databaseName: 'string',
    databaseDescription: 'string',
    clientId: 'string',
    clientSecret: 'string',
  };
  const mockRegistertenantService = {
    register: jest.fn(),
    getIdSecret: jest.fn(),
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
    const mockMessage = { Message: 'Tenant Registered Successfully' };
    mockRegistertenantService.register.mockResolvedValue(mockMessage);
    expect(
      await registertenantController.registerTenant(TenantDetails),
    ).toEqual(mockMessage);
  });

  it('Testing registerTenantcontroller getClientIdSecret', async () => {
    const tenantname = 'string';
    const mockMessage = { Message: 'Client Id and Secret Successfully' };
    mockRegistertenantService.getIdSecret.mockResolvedValue(mockMessage);
    expect(
      await registertenantController.getClientIdSecret(tenantname),
    ).toEqual(mockMessage);
  });

  it('Testing listAllTenant', async () => {
    const query = {
      tenantName: 'tenantName',
      isDeleted: true,
      page: 1,
    };
    const mockMessage = { Message: 'All Tenant received Successfully' };
    mockRegistertenantService.listAll.mockResolvedValue(mockMessage);
    expect(await registertenantController.listAllTenant(query)).toEqual(
      mockMessage,
    );
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
