import { Keycloak, KeycloakAuthScope, KeycloakClient, KeycloakUser } from "@app/iam";
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
                    createAuthorizationScope: jest.fn()
                }
            };
        })
    };
});

describe('Testing Keycloak Authorization Scope', () => {
    let keycloakAuthScope: KeycloakAuthScope;

    beforeAll(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakClient, KeycloakUser, KeycloakAuthScope, ConfigService]
        }).compile();

        keycloakAuthScope = module.get<KeycloakAuthScope>(KeycloakAuthScope);
    });
    it('Testing "createScope" method', async () => {
        const mockTenantuser = {
            tenantName: 'string',
            password: 'string',
        };
        const mockclientName = 'string';
        const mockscopeDetails = {
            name: "test-scope",
        }

        const response = await keycloakAuthScope.createScope(mockTenantuser, mockclientName, mockscopeDetails);
        expect(response).toEqual('Scope created successfully');
    });
});