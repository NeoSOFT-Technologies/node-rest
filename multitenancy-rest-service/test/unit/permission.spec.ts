import { Keycloak, KeycloakAuthPermission, KeycloakClient, KeycloakUser } from "@app/iam";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
                users: {
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            username: 'adminuser'
                        }
                    ]),
                },
                clients: {
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'string',
                        }
                    ]),
                    createPermission: jest.fn()
                }
            };
        })
    };
});

describe('Testing Keycloak Authorization Permission', () => {
    let keycloakAuthPermission: KeycloakAuthPermission;

    beforeAll(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakClient, KeycloakUser, KeycloakAuthPermission, ConfigService]
        }).compile()

        keycloakAuthPermission = module.get<KeycloakAuthPermission>(KeycloakAuthPermission);
    });

    it('Testing "createPermission" method', async() => {
        const mockTenantuser = {
            tenantName: 'string',
            password: 'string',
        };
        const mockclientName = 'string';
        const permissionType = 'user';
        const mockPermisionDetails = {
            name: "test-permission",
            description: "test permission description"
        }

        const response = await keycloakAuthPermission.createPermission(mockTenantuser, mockclientName, permissionType, mockPermisionDetails);
        expect(response).toEqual('Permission created successfully');
    });
});