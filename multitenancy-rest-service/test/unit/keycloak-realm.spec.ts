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
                    findOneByName: jest.fn().mockResolvedValue({
                        id: 'id',
                        name: 'name'
                    }),
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
        const token = 'Bearer token';
        const response = await keycloakRealmService.createRealm('string', 'string', 'string', token);
        expect(response).toEqual('Realm created successfully');
    });
});
