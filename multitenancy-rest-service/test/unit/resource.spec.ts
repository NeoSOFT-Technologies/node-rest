import { KeycloakAuthResource, KeycloakClient } from '@app/iam';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                clients: {
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'string',
                        }
                    ]),
                    createResource: jest.fn()
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak Auth Resource', () => {
    let keycloakAuthResource: KeycloakAuthResource;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [KeycloakClient, ConfigService, KeycloakAuthResource],
        }).compile();

        keycloakAuthResource = module.get<KeycloakAuthResource>(KeycloakAuthResource);
    });

    it('Testing "createResource" method', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            resourceDetails: {
                name: "test-resource",
                uris: ["/*"]
            }
        };
        const token = 'Bearer token';
        const response = await keycloakAuthResource.createResource(body, token);
        expect(response).toEqual('Resource created successfully');
    });
});
