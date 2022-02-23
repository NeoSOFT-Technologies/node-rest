import { Test, TestingModule } from '@nestjs/testing';
import { Keycloak } from '@app/iam/keycloak';
import { KeycloakRealm } from '@app/iam/keycloakRealm';
import { ConfigService } from '@nestjs/config';
import { KeycloakUser } from '@app/iam/keycloakUser';

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

describe('Testing Keycloak User Service', () => {
    let keycloakUserService: KeycloakUser;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakRealm, ConfigService, KeycloakUser],
        }).compile();

        keycloakUserService = module.get<KeycloakUser>(KeycloakUser);
    });

    it('Tetsing "createUser" method', async () => {
        const mockTenantuser = {
            userName:'string',
            email:'stirng',
            password:'string',
            tenantName:'string'
        };
        const response = await keycloakUserService.createUser(mockTenantuser);
        expect(response).toEqual('User created successfully');
    });

    it('Testing "createAdminUser" method', async () => {
        const response = await keycloakUserService.createAdminUser('string','string','string');
        expect(response.id).toEqual('id');
    });
});