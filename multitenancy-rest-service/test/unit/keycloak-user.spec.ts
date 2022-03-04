import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Keycloak, KeycloakRealm, KeycloakUser } from '@app/iam';
import axios from 'axios';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
                users: {
                    create: jest.fn().mockResolvedValue({
                        id: 'id'
                    }),
                    addRealmRoleMappings: jest.fn(),
                },
                roles: {
                    create: jest.fn(),
                    findOneByName: jest.fn().mockResolvedValue({
                        id: 'id',
                        name: 'name'
                    }),
                },
            };
        })
    };
});

describe('Testing Keycloak User Service', () => {
    let keycloakUserService: KeycloakUser;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Keycloak, KeycloakRealm, ConfigService, KeycloakUser],
        }).compile();

        keycloakUserService = module.get<KeycloakUser>(KeycloakUser);
    });

    it('Testing "createUser" method', async () => {
        const mockTenantCredentials = {
            tenantName: 'string',
            password: 'string'
        };
        const mockUserDetails = {
            userName: 'string',
            email: 'stirng',
            password: 'string',
        };
        const response = await keycloakUserService.createUser(mockTenantCredentials, mockUserDetails);
        expect(response).toEqual('User created successfully');
    });

    it('Testing "getUsers" method', async () => {
        const mockData = {
            query: {
                tenantName: 'string',
                page: 1
            },
            token: 'Bearer token'
        };
        const mockAxiosGet = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: 'sample-user' });
        mockAxiosGet.mockResolvedValueOnce({ data: 'sample-count' })
        const response = await keycloakUserService.getUsers(mockData);
        expect(response).toEqual({ data: 'sample-user', count: 'sample-count' });
        mockAxiosGet.mockRestore();
    });

    it('Testing "createAdminUser" method', async () => {
        const response = await keycloakUserService.createAdminUser('string', 'string', 'string');
        expect(response.id).toEqual('id');
    });
});