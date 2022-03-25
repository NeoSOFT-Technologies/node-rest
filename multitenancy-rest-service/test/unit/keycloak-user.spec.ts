import { Keycloak, KeycloakUser } from '@app/iam';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                users: {
                    create: jest.fn().mockResolvedValue({
                        id: 'id'
                    }),
                    find: jest.fn().mockResolvedValue([{
                        username: 'sample-user',
                        email: 'sample-email',
                        createdTimestamp: 1647865779127
                    }]),
                    count: jest.fn().mockResolvedValue(1),
                    addRealmRoleMappings: jest.fn(),
                    delRealmRoleMappings: jest.fn(),
                    listRealmRoleMappings: jest.fn().mockResolvedValue([{ name: 'sample-role' }]),
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
                clients: {
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'test-client',
                        }
                    ]),
                    evaluateResource: jest.fn().mockResolvedValue({
                        results: [{
                            status: 'PERMIT',
                            policies: [{
                                policy: {
                                    name: 'sample-permission'
                                }
                            }]
                        }]
                    })
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

    it('Testing "createAdminUser" method', async () => {
        const response = await keycloakUserService.createAdminUser('string', 'string', 'string');
        expect(response.id).toEqual('id');
    });

    it('Testing "createUser" method', async () => {
        const mockTenantCredentials = {
            tenantName: 'string',
        };
        const mockUserDetails = {
            userName: 'string',
            email: 'stirng',
            password: 'string',
            roles: ['role']
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
        expect(response).toEqual({
            data: [
                {
                    userName: 'sample-user',
                    email: 'sample-email',
                    createdTimestamp: '2022/03/21 17:59:39'
                }
            ],
            count: 1
        });
    });

    it('Testing "getUserInfo" method', async () => {
        const tenantName = 'string';
        const userName = 'string';
        const clientName = 'string';
        const token: string = 'Bearer token';

        const response = await keycloakUserService.getUserInfo({ tenantName, userName, clientName }, token);
        expect(response).toEqual({
            username: 'sample-user',
            email: 'sample-email',
            createdTimestamp: '2022/03/21 17:59:39',
            tenantName: 'string',
            roles: ['sample-role'],
            permissions: ['sample-permission']
        });
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

    it('Testing "getAdminDetails" method', async () => {
        const userName = 'string';
        const token = 'Bearer token';

        const response = await keycloakUserService.getAdminDetails(userName, token);
        expect(response).toEqual({
            username: 'sample-user',
            email: 'sample-email',
            createdTimestamp: '2022/03/21 17:59:39',
            roles: ['sample-role'],
        });
    });
});