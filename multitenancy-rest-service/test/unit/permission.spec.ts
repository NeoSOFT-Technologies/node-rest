import { KeycloakAuthPermission, KeycloakClient } from "@app/iam";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

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
                    findPermissions: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            name: 'name'
                        }
                    ]),
                    createPermission: jest.fn(),
                    updatePermission: jest.fn(),
                    delPermission: jest.fn().mockResolvedValue([
                        {
                            id: 'id',
                            type: 'string',
                            permissionId: 'test-permission'
                        }
                    ]),
                },
                setAccessToken: jest.fn()
            };
        })
    };
});

describe('Testing Keycloak Authorization Permission', () => {
    let keycloakAuthPermission: KeycloakAuthPermission;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [KeycloakClient, ConfigService, KeycloakAuthPermission]
        }).compile()

        keycloakAuthPermission = module.get<KeycloakAuthPermission>(KeycloakAuthPermission);
    });

    it('Testing "createPermission" method', async () => {
        const body = {
            tenantName: 'string',
            permissionType: 'user',
            clientName: 'string',
            permissionDetails: {
                name: "test-permission",
                description: "test permission description"
            }
        };
        const token = 'Bearer token';
        const response = await keycloakAuthPermission.createPermission(body, token);
        expect(response).toEqual('Permission created successfully');
    });

    it('Testing "getPermissions" method', async () => {
        const tenantName = 'string';
        const clientName = 'string';
        const token = 'Bearer token';

        const response = await keycloakAuthPermission.getPermissions(tenantName, clientName, token);
        expect (response).toEqual([{
            id: 'id',
            name: 'name'
        }]);
    });

    it('Testing "updatePermission" method', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            permissionName: 'string',
            permissionType: 'user',
            permissionDetails: {
                name: "test-permission",
                description: "test permission description"
            }
        };
        const token = 'Bearer token';
        const response = await keycloakAuthPermission.updatePermission(body, token);
        expect(response).toEqual('Permission updated successfully');
    });

    it('Testing "deletePermission" method', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            permissionName: 'string',
            permissionType: 'user'
        };
        const token = 'Bearer token';
        const response = await keycloakAuthPermission.deletePermission(body, token);
        expect(response).toEqual('Permission deleted successfully');
    });
});
