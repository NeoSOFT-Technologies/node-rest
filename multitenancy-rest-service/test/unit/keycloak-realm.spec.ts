import { Keycloak, KeycloakRealm, KeycloakUser } from '@app/iam';
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
                    addRealmRoleMappings: jest.fn(),
                },
                realms: {
                    create: jest.fn().mockResolvedValue({
                        realmName: 'string'
                    })
                },
                roles: {
                    create: jest.fn(),
                    find: jest.fn().mockResolvedValue([{ name: 'sample-role' }]),
                    findOneByName: jest.fn().mockResolvedValue({
                        id: 'id',
                        name: 'name'
                    }),
                    updateByName: jest.fn(),
                    delByName: jest.fn(),
                    createComposite: jest.fn()
                },
                clients: {
                    find: jest.fn().mockResolvedValue([
                        {
                            clientId: 'realm-management',
                            id: 'id'
                        }
                    ]),
                    listRoles: jest.fn().mockResolvedValue([
                        {
                            id: 'id'
                        }
                    ])
                },
                setAccessToken: jest.fn()
            };
        })
    };
});


describe('Testing Keycloak Realm Service', () => {
    let keycloakRealmService: KeycloakRealm
    const mockService = {
        createAdminUser: jest.fn().mockResolvedValue({
            id: 'id'
        })
    };

    const authToken = 'Bearer token';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, Keycloak, KeycloakUser, KeycloakRealm],
        })
            .overrideProvider(KeycloakUser)
            .useValue(mockService)
            .compile();

        keycloakRealmService = module.get<KeycloakRealm>(KeycloakRealm);
    });

    it('Testing "createRealm" method', async () => {
        const response = await keycloakRealmService.createRealm('string','string', 'string', 'string', authToken);
        expect(response).toEqual('Realm created successfully');
    });

    it('Testing "createRealmRoles" method', async () => {
        const tenantName = 'string';
        const roleDetails = {
            name: 'string'
        }

        const response = await keycloakRealmService.createRealmRoles(tenantName, roleDetails, authToken);
        expect(response).toEqual('Role created successfully');
    });

    it('Testing "getRealmRoles" method', async () => {
        const tenantName = 'string';

        const response = await keycloakRealmService.getRealmRoles(tenantName, authToken);
        expect(response).toEqual(['sample-role']);
    });

    it('Testing "getRealmRoleInfo" method', async () => {
        const tenantName = 'string';
        const roleName = 'string';

        const response = await keycloakRealmService.getRealmRoleInfo(tenantName, roleName, authToken);
        expect(response).toEqual({ id: 'id', name: 'name' });
    });

    it('Testing "updateRealmRoles" method', async () => {
        const tenantName = 'string';
        const roleName = 'string';
        const roleDetails = {
            name: 'string'
        };

        const response = await keycloakRealmService.updateRealmRoles(tenantName, roleName, roleDetails, authToken);
        expect(response).toEqual('Role updated successfully');
    });

    it('Testing "deleteRealmRoles" method', async () => {
        const tenantName = 'string';
        const roleName = 'string';

        const response = await keycloakRealmService.deleteRealmRoles(tenantName, roleName, authToken);
        expect(response).toEqual('Role deleted successfully');
    });
});
