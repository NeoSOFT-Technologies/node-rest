import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionUtils } from './utils';
import {
  ClientDto, DbDetailsDto, DeleteUserDto, PolicyDto, ProvisionTenantTableDto,
  RegisterTenantDto, ResourceDto, TenantUserDto, UpdateUserDto, UsersQueryDto
} from './dto';
import {
  KeycloakAuthPolicy, KeycloakAuthResource, KeycloakClient,
  KeycloakRealm, KeycloakUser, KeycloakAuthScope
} from './iam';
import { ScopeDto } from './dto';

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
    private readonly keycloakAuthScope: KeycloakAuthScope
  ) { }
  register(tenant: RegisterTenantDto) {
    return this.client1.send({ cmd: 'register-tenant' }, tenant);
  }
  getTenantConfig(id: number) {
    return this.client2.send({ cmd: 'get_config' }, id);
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
  createRealm(tenantDetails: RegisterTenantDto) {
    const { tenantName, email, password } = tenantDetails;
    return this.keycloakRealm.createRealm(tenantName, email, password);
  }
  createUser(body: TenantUserDto, token: string) {
    const { userDetails, ...user } = body;
    return this.keycloakUser.createUser(user, userDetails, token);
  }
  listAllUser(data: { query: UsersQueryDto, token: string }) {
    return this.keycloakUser.getUsers(data);
  }
  updateUser(body: UpdateUserDto, token: string) {
    const { tenantName, userName, action } = body;
    return this.keycloakUser.updateUser(tenantName, userName, action, token);
  }
  deleteUser(body: DeleteUserDto, token: string) {
    const { tenantName, userName } = body;
    return this.keycloakUser.deleteUser(tenantName, userName, token);
  }
  createClient(body: ClientDto) {
    const { clientDetails, ...user } = body;
    return this.keycloakClient.createClient(user, clientDetails);
  }
  createPolicy(body: PolicyDto) {
    const { clientName, policyType, policyDetails, ...user } = body;
    return this.keycloakAuthPolicy.createPolicy(user, clientName, policyType, policyDetails);
  }
  createResource(body: ResourceDto) {
    const { clientName, resourceDetails, ...user } = body;
    return this.keycloakAuthResource.createResource(user, clientName, resourceDetails);
  }
  createScope(body: ScopeDto) {
    const { clientName, scopeDetails, ...user } = body;
    return this.keycloakAuthScope.createScope(user, clientName, scopeDetails);
  }
}
