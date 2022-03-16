import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/auth.service';
import { RegisterTenantDto } from '@app/dto/register.tenant.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import * as httpMocks from 'node-mocks-http';
import { Observable, of } from 'rxjs';

describe('Testing AppController', () => {
    let appController: AppController;
    let appService: AppService;
    let authService: AuthService;

    const mockRequest: Request = httpMocks.createRequest();
    const mockResponse: Response = httpMocks.createResponse();

    const mockTenantDetails = {
        id: 1,
        tenant_id: 1,
        tenant_name: 'string',
        description: 'string',
        createdDateTime: 'string',
        tenantDbName: 'string',
        host: 'string',
        port: 1,
    };

    const mockMessage = { Message: 'Testing' };


    const mockAppService = {
        register: jest.fn(() => of(mockMessage)),
        getTenantConfig: jest.fn(() => of(mockTenantDetails)),
        clientIdSecret: jest.fn(),
        listAllTenant: jest.fn(() => of([mockTenantDetails])),
        connect: jest.fn().mockResolvedValue('connected'),
        updateDescription: jest.fn(() => of(mockTenantDetails)),
        deleteTenant: jest.fn(() => of(mockMessage)),
        createTable: jest.fn(() => of(mockMessage)),
        createRealm: jest.fn(),
        createUser: jest.fn(),
        listAllUser: jest.fn(),
        userInfo: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        createResource: jest.fn(),
        createPolicy: jest.fn(),
        createClient: jest.fn(),
        getRoles: jest.fn(),
        createScope: jest.fn(),
        createPermission: jest.fn()
    };

    const mockAuthService = {
        getAccessToken: jest.fn().mockResolvedValue('token'),
        logout: jest.fn().mockResolvedValue('204'),
        refreshAccessToken: jest.fn().mockResolvedValue('token'),
        getUserName: jest.fn(),
        getTenantName: jest.fn().mockResolvedValue('tenantName'),
        checkUserRole: jest.fn().mockResolvedValue(false),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService, AuthService],
        })
            .overrideProvider(AppService)
            .useValue(mockAppService)
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        appController = module.get<AppController>(AppController);
        appService = module.get<AppService>(AppService);
        authService = module.get<AuthService>(AuthService);
    });

    it('Testing appcontroller "login"', async () => {
        const mockBody = {
            username: 'username',
            password: 'password',
            tenantName: 'tenantName',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
        }
        const mockgetAccessToken = jest.spyOn(authService, 'getAccessToken');
        await appController.login(mockBody, mockResponse);
        expect(mockgetAccessToken).toHaveBeenCalled();
        mockgetAccessToken.mockRestore();
    });

    it('Testing appcontroller "logout"', async () => {
        const mockBody = {
            tenantName: 'tenantName',
            refreshToken: 'refreshToken',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
        }
        const mocklogout = jest.spyOn(authService, 'logout');
        await appController.logout(mockBody, mockResponse);
        expect(mocklogout).toHaveBeenCalled();
        mocklogout.mockRestore();
    });

    it('Testing appcontroller "refreshAccessToken"', async () => {
        const mockBody = {
            tenantName: 'tenantName',
            refreshToken: 'refreshToken',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
        }
        const mockrefreshAccessToken = jest.spyOn(authService, 'refreshAccessToken');
        await appController.refreshAccessToken(mockBody, mockResponse);
        expect(mockrefreshAccessToken).toHaveBeenCalled();
        mockrefreshAccessToken.mockRestore();
    });

    it('Testing appcontroller "registerTenant"', async () => {
        const mockBody: RegisterTenantDto = {
            tenantName: 'tenantName',
            email: 'tenant@gmail.com',
            password: 'tenant123',
            description: 'This is tenant Database',
        }
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        const createRealm = jest.spyOn(appService, 'createRealm');
        const createClient = jest.spyOn(appService, 'createClient');
        await appController.registerTenant(mockBody, mockRequest, mockResponse);
        const { tenantName, email, password } = mockBody;
        expect(mockSubscribe).toHaveBeenCalled();
        expect(createRealm).toHaveBeenCalledWith(
            { tenantName, email, password },
            mockRequest.headers['authorization']);
        expect(createClient).toHaveBeenCalledWith(
            { tenantName },
            mockRequest.headers['authorization']);
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "getTenantConfig"', async () => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.getTenantConfig(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "listAllTenant"', async () => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.listAllTenant(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "updateDescription"', async () => {
        mockRequest.body = {
            action: {
                tenantName: 'string',
                description: 'string'
            }
        }
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.updateDescription(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "deleteTenant"', async () => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.deleteTenant(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "tenantUser"', async () => {
        mockRequest.body = {
            tenantName: 'tenantName',
            password: 'tenant123',
            userDetails: {
                userName: 'userName',
                email: 'tenant@gmail.com',
                password: 'user123'
            }
        };

        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createUser = jest.spyOn(appService, 'createUser');
        await appController.tenantUser(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createUser).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "listAllUser"', async () => {
        mockRequest.query = {
            tenantName: 'tenantName',
            page: '1'
        };

        mockRequest.headers = {
            authorization: 'Bearer token'
        };

        const mockSend = jest.spyOn(mockResponse, 'send');
        const listAllUser = jest.spyOn(appService, 'listAllUser');
        await appController.listAllUser(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(listAllUser).toHaveBeenCalledWith({
            query: mockRequest.query,
            token: mockRequest.headers['authorization']
        });
        mockSend.mockRestore();
    });

    it('Testing appcontroller "getUserInfo"', async () => {
        mockRequest.query = {
            tenantName: 'tenantName',
            usertName: 'usertName',
        };

        mockRequest.headers = {
            authorization: 'Bearer token'
        };

        const mockSend = jest.spyOn(mockResponse, 'send');
        const userInfo = jest.spyOn(appService, 'userInfo');
        await appController.getUserInfo(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(userInfo).toHaveBeenCalledWith(mockRequest.query,mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "updateUser"', async () => {
        mockRequest.body = {
            tenantName: 'tenantName',
            userName: 'userName',
            action: {
                firstName: 'firstName'
            }
        };

        mockRequest.headers = {
            authorization: 'Bearer token'
        };

        const mockSend = jest.spyOn(mockResponse, 'send');
        const updateUser = jest.spyOn(appService, 'updateUser');
        await appController.updateUser(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(updateUser).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "deleteUser"', async () => {
        mockRequest.body = {
            tenantName: 'tenantName',
            userName: 'userName',
        };

        mockRequest.headers = {
            authorization: 'Bearer token'
        };

        const mockSend = jest.spyOn(mockResponse, 'send');
        const deleteUser = jest.spyOn(appService, 'deleteUser');
        await appController.deleteUser(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(deleteUser).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "tenantClient"', async () => {
        mockRequest.body = {
            tenantName: 'string',
            clientDetails: {
                clientId: "test-client",
                rootUrl: "www.testUrl.com",
            },
        };
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createClient = jest.spyOn(appService, 'createClient');
        await appController.tenantClient(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createClient).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "getAvailableRoles"', async () => {
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const getRoles = jest.spyOn(appService, 'getRoles');
        await appController.getAvailableRoles(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(getRoles).toHaveBeenCalledWith('tenantName', mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "resource"', async () => {
        mockRequest.body = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            resourceDetails: { name: 'string' },
        };
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createResource = jest.spyOn(appService, 'createResource');
        await appController.resource(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createResource).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "policy"', async () => {
        mockRequest.body = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            policyType: 'string',
            policyDetails: { name: 'string' },
        };
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createPolicy = jest.spyOn(appService, 'createPolicy');
        await appController.policy(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createPolicy).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "scope"', async () => {
        mockRequest.body = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            scopeDetails: {
                name: 'string'
            }
        };
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createScope = jest.spyOn(appService, 'createScope');
        await appController.scope(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createScope).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "permission"', async () => {
        mockRequest.body = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            permissionType: 'string',
            permissionDetails: {
                name: 'string'
            }
        }
        mockRequest.headers = {
            authorization: 'Bearer token'
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createPermission = jest.spyOn(appService, 'createPermission');
        await appController.permission(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createPermission).toHaveBeenCalledWith(mockRequest.body, mockRequest.headers['authorization']);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "connectDatabase"', async () => {
        const mockSend = jest.spyOn(mockResponse, 'send');
        await appController.connectDatabase(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        mockSend.mockRestore();
    });

    it('Testing appcontroller "createTable"', async () => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.createTable(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });
});
