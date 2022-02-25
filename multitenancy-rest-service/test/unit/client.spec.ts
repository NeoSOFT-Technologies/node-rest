import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Keycloak, KeycloakClient } from '@app/iam';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
                clients: {
                    create: jest.fn(),
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'testclient',
                        }
                    ]),
                }
            };
        })
    };
});

describe('Testing Keycloak Client', () => {
    let keycloakClient: KeycloakClient;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, ConfigService, KeycloakClient],
        }).compile();

        keycloakClient = module.get<KeycloakClient>(KeycloakClient);
    });

    it('Testing "createClient" method', async () => {
        const mockTenantuser = {
            tenantName: 'string',
            password: 'string',
        };
        const clientDetails = {
            clientId: "test-client",
            rootUrl: "www.testUrl.com",
        }

        const response = await keycloakClient.createClient(mockTenantuser, clientDetails);
        expect(response).toEqual('Client created successfully');
    });

    it('Testing "findClient" method', async () => {
        const mockclientName = 'testclient';
        const kcAdminClient = new KcAdminClient();
        const response = await keycloakClient.findClient(kcAdminClient, mockclientName);
        expect(response.clientId).toEqual('testclient');
    });
});