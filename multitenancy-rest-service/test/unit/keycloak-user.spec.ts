import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Keycloak, KeycloakRealm, KeycloakUser } from '@app/iam';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
                users: {
                    create: jest.fn().mockResolvedValue({
                        id: 'id'
                    }),
                    find: jest.fn().mockResolvedValue('sample-user'),
                    count: jest.fn().mockResolvedValue('sample-count'),
                    addRealmRoleMappings: jest.fn(),
                    update: jest.fn(),
                    del: jest.fn()
                },
                roles: {
                    create: jest.fn(),
                    findOneByName: jest.fn().mockResolvedValue({
                        id: 'id',
                        name: 'name'
                    }),
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak User Service', () => {
    let keycloakUserService: KeycloakUser;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, ConfigService, KeycloakUser],
        }).compile();

        keycloakUserService = module.get<KeycloakUser>(KeycloakUser);
    });

    it('Testing "createUser" method', async () => {
        const mockTenantCredentials = {
            tenantName: 'string',
        };
        const mockUserDetails = {
            userName: 'string',
            email: 'stirng',
            password: 'string',
        };
        const token: string = 'Bearer token'
        const response = await keycloakUserService.createUser(mockTenantCredentials, mockUserDetails, token);
        expect(response).toEqual('User created successfully');
    });

    it('Testing "getUsers" method', async () => {
        const mockData = {
            query: {
                tenantName: 'string',
                page: 1
            },
            token: 'Bearer token'
        };
        const response = await keycloakUserService.getUsers(mockData);
        expect(response).toEqual({ data: 'sample-user', count: 'sample-count' });
    });

    it('Testing "updateUsers" method', async () => {
        const tenantName = 'string';
        const userName = 'string';
        const mockuserDetails = {
            firstName: 'string'
        };
        const token = 'Bearer token';

        const response = await keycloakUserService.updateUser(tenantName, userName, mockuserDetails, token);
        expect(response).toEqual('User updated successfully');
    });

    it('Testing "deleteUsers" method', async () => {
        const tenantName = 'string';
        const userName = 'string';
        const token = 'Bearer token';

        const response = await keycloakUserService.deleteUser(tenantName, userName, token);
        expect(response).toEqual('User deleted Successfully');
    });

    it('Testing "createAdminUser" method', async () => {
        const response = await keycloakUserService.createAdminUser('string', 'string', 'string');
        expect(response.id).toEqual('id');
    });
});