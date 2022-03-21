import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionUtils } from './utils';
import {
  ClientDto, CreateRealmDto, DbDetailsDto, DeleteUserDto, GetUsersInfoDto, PermissionDto, PolicyDto, ProvisionTenantTableDto,
  RegisterTenantDto, ResourceDto, TenantUserDto, UpdateUserDto, UsersQueryDto
} from './dto';
import {
  KeycloakAuthPolicy, KeycloakAuthResource, KeycloakClient,
  KeycloakRealm, KeycloakUser, KeycloakAuthScope, KeycloakAuthPermission
} from './iam';
import { ScopeDto } from './dto';
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
    private config: ConfigService
  ) { 
    this.keycloakRedirectUrl = this.config.get('keycloak.redirectUrl');
  }

  keycloakRedirectUrl: string;
  redirectUrl: string;

  register(tenant: RegisterTenantDto) {
    const { clientDetails, ...tenantDetails } = tenant;
    return this.client1.send({ cmd: 'register-tenant' }, tenantDetails);
  }
  createRedirectUrl(tenantName: string) {
    this.redirectUrl = `${this.keycloakRedirectUrl}/admin/${tenantName}/console/`;
    return this.redirectUrl;
  }
  getTenantConfig(id: number) {
    return this.client2.send({ cmd: 'get_config' }, id);
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
  listAllTenant(page: number) {
    return this.client1.send({ cmd: 'list-all-tenant' }, page);
  }
  updateDescription(tenantname: string, newdescription: string) {
    return this.client1.send({ cmd: 'update-description' }, { tenantname, newdescription });
  }
  deleteTenant(tenantname: string) {
    return this.client1.send({ cmd: 'soft-delete' }, tenantname);
  }
  connect(dbdetails: DbDetailsDto) {
    return ConnectionUtils.getConnection(dbdetails);
  }
  createTable(tableDto: ProvisionTenantTableDto) {
    return this.client3.send({ cmd: 'create-table' }, tableDto);
  }
  createRealm(tenantDetails: CreateRealmDto, token: string) {
    const { tenantName, email, password } = tenantDetails;
    return this.keycloakRealm.createRealm(tenantName, email, password, token);
  }
  createUser(body: TenantUserDto, token: string) {
    const { userDetails, ...user } = body;
    return this.keycloakUser.createUser(user, userDetails, token);
  }
  listAllUser(data: { query: UsersQueryDto, token: string }) {
    return this.keycloakUser.getUsers(data);
  }
  userInfo(query: GetUsersInfoDto, token: string) {
    const { tenantName, userName } = query;
    return this.keycloakUser.getUserInfo(tenantName, userName, token);
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
  getRoles(tenantName: string, token: string) {
    return this.keycloakUser.getRealmRoles(tenantName, token);
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
}
