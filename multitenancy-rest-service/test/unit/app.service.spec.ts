import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AppService } from '@app/app.service';

describe('Testing AppService', () => {
    let appService: AppService;
    
    const mockClient1 = {
        send: jest.fn(),
    };
    const mockClient2 = {
        send: jest.fn().mockImplementation(() => {
            return of({ Message: 'Tenant Config recieved Successfully' });
        }),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: 'REGISTER_TENANT',
                    useValue: mockClient1,
                },
                {
                    provide: 'GET_TENANT_CONFIG',
                    useValue: mockClient2,
                },
            ],
        }).compile();

        appService = module.get<AppService>(AppService);
    });

    it('Testing "register"', async () => {
        const mockMessage = { Message: 'Tenant Registered Successfully' };
        const tenantDetails = {
            email: 'string',
            password: 'string',
            description: 'string',
        };
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockregisterTenant = jest.spyOn(mockClient1, 'send');
        const response = appService.register(tenantDetails);

        expect(mockregisterTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));

        mockregisterTenant.mockRestore();
    });

    it('Testing "getTenantConfig"', async () => {
        const mockMessage = { Message: 'Tenant Config recieved Successfully' };
        const tenantId = 1;
        const mockgetTenantConfig = jest.spyOn(mockClient2, 'send');
        const response = appService.getTenantConfig(tenantId);

        expect(mockgetTenantConfig).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockgetTenantConfig.mockRestore();
    });

    it('Testing "listAllTenant"', async () => {
        const mockMessage = { Message: 'All Tenant received Successfully' };
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mocklistAllTenant = jest.spyOn(mockClient1, 'send');
        const response = appService.listAllTenant();

        expect(mocklistAllTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mocklistAllTenant.mockRestore();
    });

    it('Testing "updateDescription"', async () => {
        const mockMessage = { Message: 'Tenant Updated Successfully' };
        const tenantName = 'string';
        const newDescription = 'new description'
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockupdateDescription = jest.spyOn(mockClient1, 'send');
        const response = appService.updateDescription(tenantName, newDescription);

        expect(mockupdateDescription).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockupdateDescription.mockRestore();
    });

    it('Testing "deleteTenant"', async () => {
        const mockMessage = { Message: 'Tenant Deleted Successfully' };
        const tenantName = 'string';
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mocklistAllTenant = jest.spyOn(mockClient1, 'send');
        const response = appService.deleteTenant(tenantName);

        expect(mocklistAllTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mocklistAllTenant.mockRestore();
    });
});
