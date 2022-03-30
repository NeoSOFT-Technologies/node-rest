import { AppService } from '@app/app.service';
import { DbDetailsDto } from '@app/dto/db.details.dto';
import { Keycloak, KeycloakAuthPermission, KeycloakAuthPolicy, KeycloakAuthResource, KeycloakAuthScope, KeycloakClient, KeycloakRealm, KeycloakUser } from '@app/iam';
import { ConnectionUtils } from '@app/utils';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

describe('Testing AppService', () => {
    let appService: AppService;
    let keycloakUser: KeycloakUser;
    let keycloakRealm: KeycloakRealm;
    let keycloakClient: KeycloakClient;
    let keycloakAuthResource: KeycloakAuthResource;
    let keycloakAuthPolicy: KeycloakAuthPolicy;
    let keycloakAuthScope: KeycloakAuthScope;
    let keycloakAuthPermission: KeycloakAuthPermission;

    const mockClient1 = {
        send: jest.fn(),
    };
    const mockClient2 = {
        send: jest.fn().mockImplementation(() => {
            return of({ Message: 'Tenant Config recieved Successfully' });
        }),
    };
    const mockClient3 = {
        send: jest.fn().mockImplementation(() => {
            return of({ Message: 'Table Created successfully' });
        }),
    };
    const mockKeycloakUser = {
        createUser: jest.fn(),
        getUsers: jest.fn(),
        getUserInfo: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        getAdminDetails: jest.fn(),
    };

    const mockKeycloakRealm = {
        createRealm: jest.fn(),
        createRealmRoles: jest.fn(),
        getRealmRoles: jest.fn(),
        getRealmRoleInfo: jest.fn(),
        updateRealmRoles: jest.fn(),
        deleteRealmRoles: jest.fn(),
        deleteRealm: jest.fn()
    };

    const mockKeycloakAuthResource = {
        createResource: jest.fn(),
    };

    const mockKeycloakAuthPolicy = {
        createPolicy: jest.fn(),
    };

    const mockKeycloakAuthScope = {
        createScope: jest.fn(),
    };

    const mockKeyclakAuthPermission = {
        createPermission: jest.fn(),
        getPermissions: jest.fn(),
        updatePermission: jest.fn(),
        deletePermission: jest.fn(),
    };
    const mockKeycloakClient = {
        createClient: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Keycloak, ConfigService, KeycloakClient, AppService, KeycloakUser,
                KeycloakRealm, KeycloakAuthPolicy, KeycloakAuthResource, KeycloakAuthScope, KeycloakAuthPermission,
                {
                    provide: 'REGISTER_TENANT',
                    useValue: mockClient1,
                },
                {
                    provide: 'GET_TENANT_CONFIG',
                    useValue: mockClient2,
                },
                {
                    provide: 'CREATE_TABLE',
                    useValue: mockClient3,
                },
            ],
        })
            .overrideProvider(KeycloakUser)
            .useValue(mockKeycloakUser)
            .overrideProvider(KeycloakRealm)
            .useValue(mockKeycloakRealm)
            .overrideProvider(KeycloakClient)
            .useValue(mockKeycloakClient)
            .overrideProvider(KeycloakAuthResource)
            .useValue(mockKeycloakAuthResource)
            .overrideProvider(KeycloakAuthPolicy)
            .useValue(mockKeycloakAuthPolicy)
            .overrideProvider(KeycloakAuthScope)
            .useValue(mockKeycloakAuthScope)
            .overrideProvider(KeycloakAuthPermission)
            .useValue(mockKeyclakAuthPermission)
            .compile();

        appService = module.get<AppService>(AppService);
        keycloakUser = module.get<KeycloakUser>(KeycloakUser);
        keycloakRealm = module.get<KeycloakRealm>(KeycloakRealm);
        keycloakClient = module.get<KeycloakClient>(KeycloakClient);
        keycloakAuthResource = module.get<KeycloakAuthResource>(KeycloakAuthResource);
        keycloakAuthPolicy = module.get<KeycloakAuthPolicy>(KeycloakAuthPolicy);
        keycloakAuthScope = module.get<KeycloakAuthScope>(KeycloakAuthScope);
        keycloakAuthPermission = module.get<KeycloakAuthPermission>(KeycloakAuthPermission);
    });

    it('Testing "register"', async () => {
        const mockMessage = { Message: 'Tenant Registered Successfully' };
        const tenantDetails = {
            tenantName: 'string',
            email: 'string',
            password: 'string',
            description: 'string',
            databaseName: 'string',
            databaseDescription: 'string',
            clientDetails: {
                clientId: 'clientid'
            }
        };
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockregisterTenant = jest.spyOn(mockClient1, 'send');
        const response = appService.register(tenantDetails);

        expect(mockregisterTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));

        mockregisterTenant.mockRestore();
    });

    it('Testing "getTenantConfig"', async () => {
        const mockMessage = { Message: 'Tenant Config recieved Successfully' };
        const tenantId = 1;
        const mockgetTenantConfig = jest.spyOn(mockClient2, 'send');
        const response = appService.getTenantConfig(tenantId);

        expect(mockgetTenantConfig).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockgetTenantConfig.mockRestore();
    });

    it('Testing "listAllTenant"', async () => {
        const mockMessage = { Message: 'All Tenant received Successfully' };
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const tenantName = 'tenantName';
        const isDeleted = true;
        const page = 1;
        const mocklistAllTenant = jest.spyOn(mockClient1, 'send');
        const response = appService.listAllTenant(tenantName, isDeleted, page);

        expect(mocklistAllTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mocklistAllTenant.mockRestore();
    });

    it('Testing "connect"', async () => {
        const dbdetails: DbDetailsDto = {
            host: 'string',
            port: 1,
            tenantName: 'string',
            password: 'string',
            dbName: 'string',
        }
        const mockgetConnection = jest.spyOn(ConnectionUtils, 'getConnection');
        mockgetConnection.mockImplementation((input) => Promise.resolve(input));
        const response = await appService.connect(dbdetails);
        expect(mockgetConnection).toHaveBeenCalled();
        expect(response).toEqual(dbdetails);
        mockgetConnection.mockRestore();
    });

    it('Testing "updateDescription"', async () => {
        const mockMessage = { Message: 'Tenant Updated Successfully' };
        const tenantName = 'string';
        const newDescription = 'new description';
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockupdateDescription = jest.spyOn(mockClient1, 'send');
        const response = appService.updateDescription(tenantName, newDescription);

        expect(mockupdateDescription).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockupdateDescription.mockRestore();
    });

    it('Testing "deleteTenant"', async () => {
        const mockMessage = { Message: 'Tenant Deleted Successfully' };
        const tenantName = 'string';
        mockClient1.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const token = 'Bearer Token'
        const mocklistAllTenant = jest.spyOn(mockClient1, 'send');
        const response = await appService.deleteTenant(tenantName, token);

        expect(mocklistAllTenant).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mocklistAllTenant.mockRestore();
    });

    it('Testing "createTable"', async () => {
        const mockMessage = { Message: 'Table Created successfully' };
        const tableDto = {
            dbName: 'string',
            tableName: 'string',
            columns: [{
                columnName: 'string',
                columntype: 'string',
            }]
        };
        mockClient3.send.mockImplementation(() => {
            return of(mockMessage);
        });
        const mockCreateTable = jest.spyOn(mockClient3, 'send');
        const response = appService.createTable(tableDto);
        expect(mockCreateTable).toHaveBeenCalled();
        response.subscribe((result) => expect(result).toEqual(mockMessage));
        mockCreateTable.mockRestore();
    });

    it('Testing "createRealm"', async () => {
        const tenantDetails = {
            tenantName: 'string',
            email: 'string',
            password: 'string'
        };
        const token = 'Bearer token';
        const mockcreateRealm = jest.spyOn(keycloakRealm, 'createRealm');
        appService.createRealm(tenantDetails, token);

        expect(mockcreateRealm).toHaveBeenCalled();
        mockcreateRealm.mockRestore();
    });

    it('Testing "getAdminDetails"', async () => {
        const userName = 'userName';
        const token = 'Bearer token';
        const getAdminDetails = jest.spyOn(keycloakUser, 'getAdminDetails');
        appService.getAdminDetails(userName, token);

        expect(getAdminDetails).toHaveBeenCalled();
        getAdminDetails.mockRestore();
    });

    it('Testing "createUser"', async () => {
        const user = {
            tenantName: 'string',
            userDetails: {
                userName: 'string',
                email: 'string',
                password: 'string',
                roles: ['roles']
            }
        };
        const token = 'Bearer token';
        const mockcreateUser = jest.spyOn(keycloakUser, 'createUser');
        appService.createUser(user, token);

        expect(mockcreateUser).toHaveBeenCalled();
        mockcreateUser.mockRestore();
    });

    it('Testing "listAllUser"', async () => {
        const data = {
            query: {
                tenantName: 'string',
                page: 1,
            },
            token: 'Bearer token'
        };
        const mockgetUsers = jest.spyOn(keycloakUser, 'getUsers');
        appService.listAllUser(data);

        expect(mockgetUsers).toHaveBeenCalled();
        mockgetUsers.mockRestore();
    });

    it('Testing "userInfo"', async () => {
        const query = {
            tenantName: 'tenantName',
            userName: 'userName',
            clientName: 'clientName',
        };
        const token = 'Bearer token';
        const mockgetUserInfo = jest.spyOn(keycloakUser, 'getUserInfo');
        appService.userInfo(query, token);

        expect(mockgetUserInfo).toHaveBeenCalled();
        mockgetUserInfo.mockRestore();
    });

    it('Testing "updateUser"', async () => {
        const body = {
            tenantName: 'tenantName',
            userName: 'userName',
            action: {
                firstName: 'firstName'
            }
        };
        const token = 'Bearer token';
        const mockupdateUser = jest.spyOn(keycloakUser, 'updateUser');
        appService.updateUser(body, token);

        expect(mockupdateUser).toHaveBeenCalled();
        mockupdateUser.mockRestore();
    });

    it('Testing "deleteUser"', async () => {
        const body = {
            tenantName: 'tenantName',
            userName: 'userName',
        };
        const token = 'Bearer token';
        const mockdeleteUser = jest.spyOn(keycloakUser, 'deleteUser');
        appService.deleteUser(body, token);

        expect(mockdeleteUser).toHaveBeenCalled();
        mockdeleteUser.mockRestore();
    });

    it('Testing "createClient"', async () => {
        const body = {
            tenantName: 'string',
            clientDetails: {
                clientId: "test-client",
                rootUrl: "www.testUrl.com",
            },
        };
        const token = 'Bearer token';
        const mockcreateClient = jest.spyOn(keycloakClient, 'createClient');
        appService.createClient(body, token);

        expect(mockcreateClient).toHaveBeenCalled();
        mockcreateClient.mockRestore();
    });

    it('Testing "createRole"', async () => {
        const body = {
            tenantName: 'tenantName',
            roleDetails: {
                name: 'string'
            }
        };
        const token = 'Bearer token';
        const createRealmRoles = jest.spyOn(keycloakRealm, 'createRealmRoles');
        appService.createRole(body, token);

        expect(createRealmRoles).toHaveBeenCalled();
        createRealmRoles.mockRestore();
    });

    it('Testing "getRoles"', async () => {
        const tenantName = 'string';
        const token = 'Bearer token';
        const getRealmRoles = jest.spyOn(keycloakRealm, 'getRealmRoles');
        appService.getRoles(tenantName, token);

        expect(getRealmRoles).toHaveBeenCalled();
        getRealmRoles.mockRestore();
    });

    it('Testing "roleInfo"', async () => {
        const query = {
            tenantName: 'tenantName',
            roleName: 'roleName'
        };
        const token = 'Bearer token';
        const getRealmRoleInfo = jest.spyOn(keycloakRealm, 'getRealmRoleInfo');
        appService.roleInfo(query, token);

        expect(getRealmRoleInfo).toHaveBeenCalled();
        getRealmRoleInfo.mockRestore();
    });

    it('Testing "updateRole"', async () => {
        const body = {
            tenantName: 'tenantName',
            roleName: 'roleName',
            action: {
                name: 'string'
            }
        };
        const token = 'Bearer token';
        const updateRealmRoles = jest.spyOn(keycloakRealm, 'updateRealmRoles');
        appService.updateRole(body, token);

        expect(updateRealmRoles).toHaveBeenCalled();
        updateRealmRoles.mockRestore();
    });

    it('Testing "deleteRole"', async () => {
        const body = {
            tenantName: 'tenantName',
            roleName: 'roleName',
        };
        const token = 'Bearer token';
        const deleteRealmRoles = jest.spyOn(keycloakRealm, 'deleteRealmRoles');
        appService.deleteRole(body, token);

        expect(deleteRealmRoles).toHaveBeenCalled();
        deleteRealmRoles.mockRestore();
    });

    it('Testing "createPolicy"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            policyType: 'string',
            policyDetails: { name: 'string' },
        };
        const token = 'Bearer token';
        const mockPolicy = jest.spyOn(keycloakAuthPolicy, 'createPolicy');
        appService.createPolicy(body, token);

        expect(mockPolicy).toHaveBeenCalled();
        mockPolicy.mockRestore();
    });

    it('Testing "createResource"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            resourceDetails: { name: 'string' },
        };
        const token = 'Bearer token';
        const mockResource = jest.spyOn(keycloakAuthResource, 'createResource');
        appService.createResource(body, token);

        expect(mockResource).toHaveBeenCalled();
        mockResource.mockRestore();
    });

    it('Testing "createScope"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            scopeDetails: {
                name: 'string'
            }
        };
        const token = 'Bearer token';
        const mockScope = jest.spyOn(keycloakAuthScope, 'createScope');
        appService.createScope(body, token);

        expect(mockScope).toHaveBeenCalled();
        mockScope.mockRestore();
    });

    it('Testing "createPermission"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            permissionType: 'string',
            permissionDetails: {
                name: 'string'
            }
        };
        const token = 'Bearer token';
        const mockPermission = jest.spyOn(keycloakAuthPermission, 'createPermission');
        appService.createPermission(body, token);

        expect(mockPermission).toHaveBeenCalled();
        mockPermission.mockRestore();
    });

    it('Testing "getPermissions"', async () => {
        const query = {
            tenantName: 'string',
            clientName: 'string',
        };
        const token = 'Bearer token';
        const getPermissions = jest.spyOn(keycloakAuthPermission, 'getPermissions');
        appService.getPermissions(query, token);

        expect(getPermissions).toHaveBeenCalled();
        getPermissions.mockRestore();
    });

    it('Testing "updatePermission"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            permissionName: 'string',
            permissionType: 'string',
            permissionDetails: {
                name: 'string'
            }
        };
        const token = 'Bearer token';
        const updatePermission = jest.spyOn(keycloakAuthPermission, 'updatePermission');
        appService.updatePermission(body, token);

        expect(updatePermission).toHaveBeenCalled();
        updatePermission.mockRestore();
    });

    it('Testing "deletePermission"', async () => {
        const body = {
            tenantName: 'string',
            clientName: 'string',
            permissionName: 'string',
            permissionType: 'string',
        };
        const token = 'Bearer token';
        const deletePermission = jest.spyOn(keycloakAuthPermission, 'deletePermission');
        appService.deletePermission(body, token);

        expect(deletePermission).toHaveBeenCalled();
        deletePermission.mockRestore();
    });
});
