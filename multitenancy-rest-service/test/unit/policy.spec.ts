import { Keycloak, KeycloakAuthPolicy, KeycloakClient, KeycloakUser } from '@app/iam';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
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
                    createPolicy: jest.fn()
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak Auth Policy', () => {
    let keycloakAuthPolicy: KeycloakAuthPolicy;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakClient, KeycloakUser, ConfigService, KeycloakAuthPolicy],
        }).compile();

        keycloakAuthPolicy = module.get<KeycloakAuthPolicy>(KeycloakAuthPolicy);
    });

    it('Testing "createPolicy" method', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            policyType: 'user',
            policyDetails: {
                name: "test-policy",
                description: "test policy description"
            }
        };
        const token = 'Bearer token';
        const response = await keycloakAuthPolicy.createPolicy(body, token);
        expect(response).toEqual('Policy created successfully');
    });
});