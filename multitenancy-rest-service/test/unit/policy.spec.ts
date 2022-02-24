import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { KeycloakAuthPolicy, Keycloak, KeycloakClient, KeycloakUser } from '@app/iam';

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
                    createPolicy: jest.fn()
                }
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
        const mockTenantuser = {
            userName: 'string',
            email: 'stirng',
            password: 'string',
            tenantName: 'string'
        };
        const mockclientName = 'string';
        const policyType = 'user';
        const mockpolicyDetails = {
            name: "test-policy",
            description: "test policy description"
        }

        const response = await keycloakAuthPolicy.createPolicy(mockTenantuser, mockclientName, policyType, mockpolicyDetails);
        expect(response).toEqual('Policy created successfully');
    });
});