import { KeycloakClient } from '@app/iam';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                clients: {
                    create: jest.fn(),
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'test-client',
                        }
                    ]),
                    generateNewClientSecret: jest.fn().mockResolvedValue({ value: 'clientSecret' })
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak Client', () => {
    let keycloakClient: KeycloakClient;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, KeycloakClient],
        }).compile();

        keycloakClient = module.get<KeycloakClient>(KeycloakClient);
    });

    it('Testing "createClient" method', async () => {
        const body = {
            tenantName: 'string',
            clientDetails: {
                clientId: "test-client",
                rootUrl: "www.testUrl.com",
            }
        };
        const token = 'Bearer token';
        const response = await keycloakClient.createClient(body, token);
        expect(response).toEqual({ clientId: "test-client", clientSecret: "clientSecret" });
    });

    it('Testing "findClient" method', async () => {
        const mockclientName = 'test-client';
        const kcAdminClient = new KcAdminClient();
        const response = await keycloakClient.findClient(kcAdminClient, mockclientName);
        expect(response.clientId).toEqual('test-client');
    });
});