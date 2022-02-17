import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AppService } from '@app/app.service';
import { ConnectionUtils } from '@app/connection.utils';
import { DbDetailsDto } from '@app/dto/db.details.dto';
import { KeycloakUser } from '@app/iam/keycloakUser';
import { KeycloakRealm } from '@app/iam/keycloakRealm';

describe('Testing AppService', () => {
    let appService: AppService;
    let keycloakUser: KeycloakUser;
    let keycloakRealm: KeycloakRealm;

    const mockClient1 = {
        send: jest.fn(),
    };
    const mockClient2 = {
        send: jest.fn().mockImplementation(() => {
            return of({ Message: 'Tenant Config recieved Successfully' });
        }),
    };
    const mockClient3 = {
        send: jest.fn().mockImplementation(() => {
            return of({ Message: 'Table Created successfully' });
        }),
    };
    const mockKeycloakUser = {
        createUser: jest.fn()
    };

    const mockKeycloakRealm = {
        createRealm: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService, KeycloakUser, KeycloakRealm,
                {
                    provide: 'REGISTER_TENANT',
                    useValue: mockClient1,
                },
                {
                    provide: 'GET_TENANT_CONFIG',
                    useValue: mockClient2,
                },
                {
                    provide: 'CREATE_TABLE',
                    useValue: mockClient3,
                },
            ],
        })
            .overrideProvider(KeycloakUser)
            .useValue(mockKeycloakUser)
            .overrideProvider(KeycloakRealm)
            .useValue(mockKeycloakRealm)
            .compile();

        appService = module.get<AppService>(AppService);
        keycloakUser = module.get<KeycloakUser>(KeycloakUser);
        keycloakRealm = module.get<KeycloakRealm>(KeycloakRealm);
    });

    it('Testing "register"', async () => {
        const mockMessage = { Message: 'Tenant Registered Successfully' };
        const tenantDetails = {
            email: 'string',
            password: 'string',
            description: 'string',
            tenantName: 'string'
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

    it('Testing "connect"', async () => {
        const dbdetails: DbDetailsDto = {
            host: 'string',
            port: 1,
            tenantName: 'string',
            password: 'string',
            dbName: 'string',
        }
        const mockgetConnection = jest.spyOn(ConnectionUtils, 'getConnection');
        mockgetConnection.mockImplementation((input) => Promise.resolve(input));
        const response = await appService.connect(dbdetails);
        expect(mockgetConnection).toHaveBeenCalled();
        expect(response).toEqual(dbdetails);
        mockgetConnection.mockRestore();
    });

    it('Testing "updateDescription"', async () => {
        const mockMessage = { Message: 'Tenant Updated Successfully' };
        const tenantName = 'string';
        const newDescription = 'new description';
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

    it('Testing "createTable"', async () => {
        const mockMessage = { Message: 'Table Created successfully' };
        const tableDto = {
            dbName: 'string',
            tableName: 'string',
            columns: [{
                columnName: 'string',
                columntype: 'string',
            }]
        };
        mockClient3.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockCreateTable = jest.spyOn(mockClient3, 'send');
        const response = appService.createTable(tableDto);
        expect(mockCreateTable).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockCreateTable.mockRestore();
    });

    it('Testing "createRealm"', async () => {
        const tenantDetails = {
            tenantName: 'string',
            email: 'string',
            password: 'string',
            description: 'string'
        };
        const mockcreateRealm = jest.spyOn(keycloakRealm, 'createRealm');
        appService.createRealm(tenantDetails);

        expect(mockcreateRealm).toHaveBeenCalled();
        mockcreateRealm.mockRestore();
    });

    it('Testing "createUser"', async () => {
        const user = {
            userName: 'string',
            email: 'string',
            password: 'string',
            tenantName: 'string',
        };
        const mockcreateUser = jest.spyOn(keycloakUser, 'createUser');
        appService.createUser(user);

        expect(mockcreateUser).toHaveBeenCalled();
        mockcreateUser.mockRestore();
    });
});
