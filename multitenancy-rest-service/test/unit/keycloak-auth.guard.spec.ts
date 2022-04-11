import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/auth.service';
import { KeycloakAuthGuard } from '@app/auth/guards/keycloak-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import config from '@app/config';


describe('Testing Auth Service', () => {
    let kcAuthGuard: KeycloakAuthGuard;
    let authService: AuthService;
    // let appService: AppService;
    let reflector: Reflector;

    const mockAuthService = {
        validateToken: jest.fn().mockResolvedValue(true),
        validateTokenwithKey: jest.fn().mockResolvedValue('token'),
        getRoles: jest.fn().mockResolvedValue(['mockRole']),
        getTenantName: jest.fn().mockResolvedValue('tenantName')
    };

    const mockAppService = {
        clientIdSecret: jest.fn().mockResolvedValue({
            clientId: 'clientId',
            clientSecret: 'clientSecret'
        }),
    };

    const mockReflector = {
        get: jest.fn().mockReturnValue(['mockRole']),
    };



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: [`${process.cwd()}/config/.env`],
                    isGlobal: true,
                    expandVariables: true,
                    load: config,
                })],
            providers: [
                KeycloakAuthGuard,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: AppService,
                    useValue: mockAppService,
                },
                {
                    provide: Reflector,
                    useValue: mockReflector,
                },
            ],
        }).compile();

        kcAuthGuard = module.get<KeycloakAuthGuard>(KeycloakAuthGuard);
        authService = module.get<AuthService>(AuthService);
        // appService = module.get<AppService>(AppService);
        reflector = module.get<Reflector>(Reflector);
    });

    it('Testing "canActivate"', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue('Bearer token')
                }),
            })),
        } as any;
        const response = await kcAuthGuard.canActivate(mockContext);

        expect(reflector.get).toHaveBeenCalled();
        // expect(appService.clientIdSecret).toHaveBeenCalledWith('tenantName');
        // expect(authService.validateToken).toHaveBeenCalledWith('token', 'clientId', 'clientSecret');
        expect(authService.validateTokenwithKey).toHaveBeenCalled();
        expect(authService.getRoles).toHaveBeenCalledWith('token');
        expect(response).toEqual(true);
    });

    it('Testing "canActivate" - when header not present', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue('')
                }),
            })),
        } as any;


        expect(async () => await kcAuthGuard.canActivate(mockContext)).rejects.toThrow(
            'Authorization: Bearer <token> header missing'
        );
    });

    it('Testing "canActivate" - when token header is invalid', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue('Bearer')
                }),
            })),
        } as any;
        expect(async () => await kcAuthGuard.canActivate(mockContext)).rejects.toThrow(
            'Authorization: Bearer <token> header invalid'
        );
    });

    it('Testing "canActivate" - when token is invalid', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue('Bearer token')
                }),
            })),
        } as any;
        // mockAuthService.validateToken.mockResolvedValue(false);
        mockAuthService.validateTokenwithKey.mockRejectedValue(new Error('Authorization: Bearer <token> invalid'));

        expect(async () => await kcAuthGuard.canActivate(mockContext)).rejects.toThrow(
            'Authorization: Bearer <token> invalid'
        );
    });

    it('Testing "canActivate" - when required role not present', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue('Bearer token')
                }),
            })),
        } as any;
        // mockAuthService.validateToken.mockResolvedValue(true);
        mockAuthService.validateTokenwithKey.mockResolvedValue('token');
        mockReflector.get.mockReturnValue(['required-role']);
        const response = await kcAuthGuard.canActivate(mockContext);
        expect(response).toEqual(false);
    });

    it('Testing "hasRole" - when required role present', async () => {
        const response = await kcAuthGuard.hasRole(['mockRole1', 'mockRole2', 'requiredRole'], ['requiredRole']);
        expect(response).toEqual(true);
    });

    it('Testing "hasRole" - when required role not present', async () => {
        const response = await kcAuthGuard.hasRole(['mockRole1', 'mockRole2'], ['requiredRole']);
        expect(response).toEqual(false);
    });
});
