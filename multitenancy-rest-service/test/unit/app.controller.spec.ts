import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Request, Response } from 'express';
import * as httpMocks from 'node-mocks-http';
import { Observable, of } from 'rxjs';
import { RegisterTenantDto } from '@app/dto/register.tenant.dto';

describe('Testing AppController', () => {
    let appController: AppController;

    const mockRequest: Request = httpMocks.createRequest();
    const mockResponse: Response = httpMocks.createResponse();
    const mockBody: RegisterTenantDto = {
        tenantName:'tenantName',
        email:'tenant@gmail.com',
        password:'tenant123',
        description:'This is tenant Database',

    }
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
        createTable: jest.fn(() => of(mockMessage))
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        })
            .overrideProvider(AppService)
            .useValue(mockAppService)
            .compile();

        appController = module.get<AppController>(AppController);
    });

    it('Testing appcontroller "registerTenant"', async () => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.registerTenant(mockBody, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
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

    it('Testing appcontroller "connectDatabase"', async () => {
        const mockSend = jest.spyOn(mockResponse, 'send');
        await appController.connectDatabase(mockRequest, mockResponse);
        expect(mockSend).toHaveBeenCalled();
        mockSend.mockRestore();
    });

    it('Testing appcontroller "updateDescription"', async () => {
        mockRequest.body = {
            action :{
                tenantName:'string',
                description:'string'
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
    
    it('Testing appcontroller "createTable"', async() => {
        const mockSubscribe = jest.spyOn(Observable.prototype, 'subscribe');
        await appController.createTable(mockRequest, mockResponse);
        expect(mockSubscribe).toHaveBeenCalled();
        mockSubscribe.mockRestore();
    });
});
