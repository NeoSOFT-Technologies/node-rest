import { Test, TestingModule } from '@nestjs/testing';
import { Keycloak } from '@app/iam/keycloak';

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

describe('Testing KeyCloak Service', () => {
    let keycloak: Keycloak;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak],
        }).compile();

        keycloak = module.get<Keycloak>(Keycloak);
    });
    
    it('Tetsing "createRealm" method', async () => {
        const response = await keycloak.createRealm('string', 'string', 'string');
        expect(response).toEqual('Realm created successfully');
    });

    it('Tetsing "createUser" method', async () => {
        const mockTenantuser = {
            userName:'string',
            email:'stirng',
            password:'string',
            tenantName:'string'
        };
        const response = await keycloak.createUser(mockTenantuser);
        expect(response).toEqual('User created successfully');
    });
});
