import { KeycloakAuthScope, KeycloakClient } from "@app/iam";
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
                            username: 'tenantadmin'
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
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak Authorization Scope', () => {
    let keycloakAuthScope: KeycloakAuthScope;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [KeycloakClient, ConfigService, KeycloakAuthScope]
        }).compile();

        keycloakAuthScope = module.get<KeycloakAuthScope>(KeycloakAuthScope);
    });
    it('Testing "createScope" method', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            scopeDetails: {
                name: "test-scope",
            }
        };
        const token = 'Bearer token';
        const response = await keycloakAuthScope.createScope(body, token);
        expect(response).toEqual('Scope created successfully');
    });
});