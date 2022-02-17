import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakAuthGuard } from '@app/auth/guards/keycloak-auth.guard';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@app/auth/auth.service';


describe('Testing Auth Service', () => {
    let kcAuthGuard: KeycloakAuthGuard;
    let authService: AuthService;
    let reflector: Reflector;

    const mockAuthService = {
        validateToken: jest.fn().mockResolvedValue(true),
        getUserRoles: jest.fn().mockResolvedValue(['mockRole'])
    };

    const mockReflector = {
        get: jest.fn().mockReturnValue(['mockRole']),
    };



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KeycloakAuthGuard,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: Reflector,
                    useValue: mockReflector,
                },
            ],
        }).compile();

        kcAuthGuard = module.get<KeycloakAuthGuard>(KeycloakAuthGuard);
        authService = module.get<AuthService>(AuthService);
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
        expect(authService.validateToken).toHaveBeenCalledWith('token');
        expect(authService.getUserRoles).toHaveBeenCalledWith('token');
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
        mockAuthService.validateToken.mockResolvedValue(false);

        expect(async () => await kcAuthGuard.canActivate(mockContext)).rejects.toThrow(
            'Authorization: Bearer <token> invalid'
        );

        mockAuthService.validateToken.mockResolvedValue(true);
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
