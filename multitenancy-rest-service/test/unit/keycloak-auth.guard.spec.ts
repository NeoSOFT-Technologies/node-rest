import { AppService } from '@app/app.service';
import { AuthService } from '@app/auth/auth.service';
import { KeycloakAuthGuard } from '@app/auth/guards/keycloak-auth.guard';
import { PublicKeyCache } from '@app/auth/cache.publicKey';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('Testing Auth Service', () => {
    let kcAuthGuard: KeycloakAuthGuard;
    let authService: AuthService;
    let publicKeyCache: PublicKeyCache;
    let reflector: Reflector;

    const mockAuthService = {
        validateToken: jest.fn().mockResolvedValue(true),
        validateTokenwithKey: jest.fn().mockResolvedValue('token'),
        getRoles: jest.fn().mockResolvedValue(['roles']),
        getPermissions: jest.fn().mockResolvedValue(['permissions']),
        getTenantName: jest.fn().mockResolvedValue('tenantName')
    };

    const mockPublicKeyCache = {
        getPublicKey: jest.fn().mockResolvedValue('key'),
    };

    const mockAppService = {
        clientIdSecret: jest.fn().mockResolvedValue({
            clientId: 'clientId',
            clientSecret: 'clientSecret'
        }),
    };

    const mockReflector = {
        get: jest.fn().mockImplementation(arg => [arg]),
    };


    const authToken = 'Bearer token';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KeycloakAuthGuard,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: PublicKeyCache,
                    useValue: mockPublicKeyCache,
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
        publicKeyCache = module.get<PublicKeyCache>(PublicKeyCache);
        reflector = module.get<Reflector>(Reflector);
    });

    it('Testing "canActivate"', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue(authToken)
                }),
            })),
        } as any;
        const response = await kcAuthGuard.canActivate(mockContext);

        expect(reflector.get).toHaveBeenCalledTimes(2);
        expect(publicKeyCache.getPublicKey).toHaveBeenCalled();
        expect(authService.validateTokenwithKey).toHaveBeenCalled();
        expect(authService.getRoles).toHaveBeenCalledWith('token');
        expect(authService.getPermissions).toHaveBeenCalledWith('token');
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
                    header: jest.fn().mockReturnValue(authToken)
                }),
            })),
        } as any;
        mockAuthService.validateTokenwithKey.mockRejectedValueOnce(new Error('Authorization: Bearer <token> invalid'));

        expect(async () => await kcAuthGuard.canActivate(mockContext)).rejects.toThrow(
            'Authorization: Bearer <token> invalid'
        );
    });

    it('Testing "canActivate" - when required role not present', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue(authToken)
                }),
            })),
        } as any;
        mockReflector.get.mockReturnValueOnce(['required-role']);
        const response = await kcAuthGuard.canActivate(mockContext);
        expect(response).toEqual(false);
    });

    it('Testing "canActivate" - when required permission not present', async () => {
        const mockContext = {
            getHandler: jest.fn(),
            switchToHttp: jest.fn(() => ({
                getRequest: jest.fn().mockReturnValue({
                    header: jest.fn().mockReturnValue(authToken)
                }),
            })),
        } as any;
        mockReflector.get
        .mockReturnValueOnce(['roles'])
        .mockReturnValueOnce(['required-permission']);
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
