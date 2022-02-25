import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Request, Response } from 'express';
import * as httpMocks from 'node-mocks-http';
import { Observable, of } from 'rxjs';
import { RegisterTenantDto } from '@app/dto/register.tenant.dto';
import { TenantUserDto } from '@app/dto/tenant.user.dto';
import { AuthService } from '@app/auth/auth.service';

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
        listAllTenant: jest.fn(() => of([mockTenantDetails])),
        connect: jest.fn().mockResolvedValue('connected'),
        updateDescription: jest.fn(() => of(mockTenantDetails)),
        deleteTenant: jest.fn(() => of(mockMessage)),
        createTable: jest.fn(() => of(mockMessage)),
        createRealm: jest.fn(),
        createUser: jest.fn(),
        createResource: jest.fn(),
        createPolicy: jest.fn(),
        createClient: jest.fn()
    };

    const mockAuthService = {
        getAccessToken: jest.fn().mockResolvedValue('token'),
        logout: jest.fn().mockResolvedValue('204')
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
        }
        const mocklogout = jest.spyOn(authService, 'logout');
        await appController.logout(mockBody, mockResponse);
        expect(mocklogout).toHaveBeenCalled();
        mocklogout.mockRestore();
    });

    it('Testing appcontroller "registerTenant"', async () => {
        const mockBody: RegisterTenantDto = {
            tenantName: 'tenantName',
            email: 'tenant@gmail.com',
            password: 'tenant123',
            description: 'This is tenant Database',
        }
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        const createRealm = jest.spyOn(appService, 'createRealm');
        await appController.registerTenant(mockBody, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        expect(createRealm).toHaveBeenCalledWith(mockBody);
        mockSubscribe.mockRestore();
    });

    it('Testing appcontroller "tenantUser"', async () => {
        const mockBody: TenantUserDto = {
            userName: 'userName',
            email: 'tenant@gmail.com',
            password: 'tenant123',
            tenantName: 'tenantName',
        }
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createUser = jest.spyOn(appService, 'createUser');
        await appController.tenantUser(mockBody, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createUser).toHaveBeenCalledWith(mockBody);
        mockSend.mockRestore();
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

    it('Testing appcontroller "tenantClient"', async () => {
        const mockBody = {
            tenantName: 'string',
            password: 'string',
            clientDetails: { 
                clientId: "test-client",
                rootUrl: "www.testUrl.com",
            },
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createClient = jest.spyOn(appService, 'createClient');
        await appController.tenantClient(mockBody, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createClient).toHaveBeenCalledWith(mockBody);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "resource"', async () => {
        const mockBody = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            resourceDetails: { name: 'string' },
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createResource = jest.spyOn(appService, 'createResource');
        await appController.resource(mockBody, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createResource).toHaveBeenCalledWith(mockBody);
        mockSend.mockRestore();
    });

    it('Testing appcontroller "policy"', async () => {
        const mockBody = {
            tenantName: 'string',
            password: 'string',
            clientName: 'string',
            policyType: 'string',
            policyDetails: { name: 'string' },
        };
        const mockSend = jest.spyOn(mockResponse, 'send');
        const createPolicy = jest.spyOn(appService, 'createPolicy');
        await appController.policy(mockBody, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        expect(createPolicy).toHaveBeenCalledWith(mockBody);
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
