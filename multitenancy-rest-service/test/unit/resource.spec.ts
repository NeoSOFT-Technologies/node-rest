import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Keycloak, KeycloakClient, KeycloakAuthResource } from '@app/iam';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
                clients: {
                    find: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            clientId: 'string',
                        }
                    ]),
                    createResource: jest.fn()
                },
            };
        })
    };
});

describe('Testing Keycloak Auth Resource', () => {
    let keycloakAuthResource: KeycloakAuthResource;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakClient, ConfigService, KeycloakAuthResource],
        }).compile();

        keycloakAuthResource = module.get<KeycloakAuthResource>(KeycloakAuthResource);
    });

    it('Tetsing "createResource" method', async () => {
        const mockTenantuser = {
            userName: 'string',
            email: 'stirng',
            password: 'string',
            tenantName: 'string'
        };
        const mockclientName = 'string';
        const resourceDetails = {
            name: "test-resource",
            uris: ["/*"]
        };
        const response = await keycloakAuthResource.createResource(mockTenantuser, mockclientName, resourceDetails);
        expect(response).toEqual('Resource created successfully');
    });
});