import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionUtils } from './utils';
import {
  ClientDto, CreateRealmDto, CreateRoleDto, DbDetailsDto, DeletePermissionDto, DeleteRoleDto, DeleteUserDto,
  GetPermissionsDto, GetRoleInfoDto, GetUsersInfoDto, PermissionDto, PolicyDto, ProvisionTenantTableDto,
  RegisterTenantDto, ResourceDto, TenantUserDto, UpdatePermissionDto, UpdateRoleDto, UpdateUserDto, UsersQueryDto, ScopeDto
} from './dto';
import {
  KeycloakAuthPolicy, KeycloakAuthResource, KeycloakClient,
  KeycloakRealm, KeycloakUser, KeycloakAuthScope, KeycloakAuthPermission
} from './iam';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject('REGISTER_TENANT') private readonly client1: ClientProxy,
    @Inject('GET_TENANT_CONFIG') private readonly client2: ClientProxy,
    @Inject('CREATE_TABLE') private readonly client3: ClientProxy,
    private readonly keycloakRealm: KeycloakRealm,
    private readonly keycloakUser: KeycloakUser,
    private readonly keycloakClient: KeycloakClient,
    private readonly keycloakAuthPolicy: KeycloakAuthPolicy,
    private readonly keycloakAuthResource: KeycloakAuthResource,
    private readonly keycloakAuthScope: KeycloakAuthScope,
    private readonly keycloakAuthPermission: KeycloakAuthPermission,
    private readonly config: ConfigService
  ) { }


  register(tenant: RegisterTenantDto) {
    const { clientDetails, userName, ...tenantDetails } = tenant;
    return this.client1.send({ cmd: 'register-tenant' }, tenantDetails);
  }
  createRedirectUrl(tenantName: string) {
    const keycloakRedirectUrl = this.config.get('keycloak.redirectUrl');
    return `${keycloakRedirectUrl}/admin/${tenantName}/console/`;
  
  }
  getTenantConfig(tenantName: string) {
    return this.client2.send({ cmd: 'get_config' }, tenantName);
  }
  async clientIdSecret(tenantName: string) {
    let clientId: string;
    let clientSecret: string;

    const response = this.client1.send({ cmd: 'get-client-id-secret' }, tenantName);

    await new Promise((resolve, reject) => {
      response.subscribe({
        next: next => {
          {
            clientId = next.clientId;
            clientSecret = next.clientSecret;
          }
          resolve('done');
        },
        error: error => {
          reject(error);
        },
      });
    });

    return { clientId, clientSecret }
  }
  listAllTenant(tenantName: string, isDeleted: boolean, page: number) {
    return this.client1.send({ cmd: 'list-all-tenant' }, { tenantName, isDeleted, page });
  }
  async updateDescription(tenantname: string, newdescription: string) {
    const response = this.client2.send({ cmd: 'update-config' }, { tenantname, newdescription });
    await new Promise((resolve, reject) => {
      response.subscribe({
        next: next => {
          resolve(true);
        },
        error: error => {
          reject(error);
        },
      });
    });
    return this.client1.send({ cmd: 'update-description' }, { tenantname, newdescription });
  }
  async deleteTenant(tenantname: string, token: string) {
    await this.keycloakRealm.deleteRealm(tenantname, token);
    this.client2.emit({ cmd: 'delete-config' }, tenantname);
    return this.client1.send({ cmd: 'soft-delete' }, tenantname);
  }
  connect(dbdetails: DbDetailsDto) {
    return ConnectionUtils.getConnection(dbdetails);
  }
  createTable(tableDto: ProvisionTenantTableDto) {
    return this.client3.send({ cmd: 'create-table' }, tableDto);
  }
  async createRealm(tenantDetails: CreateRealmDto, dbName: string, token: string) {
    const { tenantName, userName, email, password } = tenantDetails;
    const response = this.client1.send({ cmd: 'check-dbName' }, dbName);
    await new Promise((resolve, reject) => {
      response.subscribe({
        next: next => {
          resolve('done');
        },
        error: error => {
          reject(error);
        },
      });
    });
    return this.keycloakRealm.createRealm(tenantName, userName, email, password, token);
  }
  getAdminDetails(userName: string, token: string) {
    return this.keycloakUser.getAdminDetails(userName, token);
  }
  createUser(body: TenantUserDto, token: string) {
    const { userDetails, ...user } = body;
    return this.keycloakUser.createUser(user, userDetails, token);
  }
  listAllUser(data: { query: UsersQueryDto, token: string }) {
    return this.keycloakUser.getUsers(data);
  }
  userInfo(query: GetUsersInfoDto, token: string) {
    if (!query.clientName) {
      query.clientName = this.keycloakClient.defaultClientDetails().clientId;
    }
    return this.keycloakUser.getUserInfo(query, token);
  }
  updateUser(body: UpdateUserDto, token: string) {
    const { tenantName, userName, action } = body;
    return this.keycloakUser.updateUser(tenantName, userName, action, token);
  }
  deleteUser(body: DeleteUserDto, token: string) {
    const { tenantName, userName } = body;
    return this.keycloakUser.deleteUser(tenantName, userName, token);
  }
  createClient(body: ClientDto, token: string) {
    if (!body.clientDetails) {
      body.clientDetails = this.keycloakClient.defaultClientDetails()
    }
    return this.keycloakClient.createClient(body, token);
  }
  createRole(body: CreateRoleDto, token: string) {
    const { tenantName, roleDetails } = body
    return this.keycloakRealm.createRealmRoles(tenantName, roleDetails, token);
  }
  getRoles(tenantName: string, token: string) {
    return this.keycloakRealm.getRealmRoles(tenantName, token);
  }
  roleInfo(query: GetRoleInfoDto, token: string) {
    const { tenantName, roleName } = query;
    return this.keycloakRealm.getRealmRoleInfo(tenantName, roleName, token);
  }
  updateRole(body: UpdateRoleDto, token: string) {
    const { tenantName, roleName, action } = body
    return this.keycloakRealm.updateRealmRoles(tenantName, roleName, action, token);
  }
  deleteRole(body: DeleteRoleDto, token: string) {
    const { tenantName, roleName } = body
    return this.keycloakRealm.deleteRealmRoles(tenantName, roleName, token);
  }
  createPolicy(body: PolicyDto, token: string) {
    return this.keycloakAuthPolicy.createPolicy(body, token);
  }
  createResource(body: ResourceDto, token: string) {
    return this.keycloakAuthResource.createResource(body, token);
  }
  createScope(body: ScopeDto, token: string) {
    return this.keycloakAuthScope.createScope(body, token);
  }
  createPermission(body: PermissionDto, token: string) {
    return this.keycloakAuthPermission.createPermission(body, token);
  }
  getPermissions(query: GetPermissionsDto, token: string) {
    let { tenantName, clientName } = query;
    if (!clientName) {
      clientName = this.keycloakClient.defaultClientDetails().clientId;
    }
    return this.keycloakAuthPermission.getPermissions(tenantName, clientName, token);
  }
  updatePermission(body: UpdatePermissionDto, token: string) {
    return this.keycloakAuthPermission.updatePermission(body, token);
  }
  deletePermission(body: DeletePermissionDto, token: string) {
    return this.keycloakAuthPermission.deletePermission(body, token);
  }
}
