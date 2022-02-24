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
                            id:'id'
                        }
                    ])
                }
            };
        })
    };
});

describe('Testing Keycloak Realm Service', () =>{
    let keycloakRealmService: KeycloakRealm
    const mockService = {
        createAdminUser: jest.fn().mockResolvedValue({
            id: 'id'
        })
    };
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakRealm, ConfigService, KeycloakUser],
        }).overrideProvider(KeycloakUser).useValue(mockService).compile();

        keycloakRealmService = module.get<KeycloakRealm>(KeycloakRealm);
    });

    it('Testing "createRealm" method', async () => {
        const response = await keycloakRealmService.createRealm('string', 'string', 'string');
        expect(response).toEqual('Realm created successfully');
    });
});
