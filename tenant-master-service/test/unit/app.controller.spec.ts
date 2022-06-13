import {AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Testing AppController', () => {
    let appController: AppController;
    let appService: AppService;

    const mockAppService = {
        getHello: jest.fn()
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
    appService = module.get<AppService>(AppService);
    });

    it('should return "Hello World!"', () => {
        const message = 'hello-message';

        const getHello = jest.spyOn(appService, 'getHello');
        appController.getConfigTenantService(message);
        expect(getHello).toHaveBeenCalledWith(message);
    });

});