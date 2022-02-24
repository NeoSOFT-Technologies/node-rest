import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionUtils } from './utils';
import { DbDetailsDto, PolicyDto, ProvisionTenantTableDto, RegisterTenantDto, ResourceDto, TenantUserDto } from './dto';
import { KeycloakAuthPolicy, KeycloakAuthResource, KeycloakRealm, KeycloakUser } from './iam';

@Injectable()
export class AppService {
  constructor(
    @Inject('REGISTER_TENANT') private readonly client1: ClientProxy,
    @Inject('GET_TENANT_CONFIG') private readonly client2: ClientProxy,
    @Inject('CREATE_TABLE') private readonly client3: ClientProxy,
    private readonly keycloakUser: KeycloakUser,
    private readonly keycloakRealm: KeycloakRealm,
    private readonly keycloakAuthPolicy: KeycloakAuthPolicy,
    private readonly keycloakAuthResource: KeycloakAuthResource,
  ) { }
  register(tenant: RegisterTenantDto) {
    return this.client1.send({ cmd: 'register-tenant' }, tenant);
  }
  getTenantConfig(id: number) {
    return this.client2.send({ cmd: 'get_config' }, id);
  }
  listAllTenant() {
    return this.client1.send({ cmd: 'list-all-tenant' }, '');
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
  createUser(user: TenantUserDto) {
    return this.keycloakUser.createUser(user);
  }
  createPolicy(body: PolicyDto) {
    const { clientName, policyType, policyDetails, ...user } = body;
    return this.keycloakAuthPolicy.createPolicy(user, clientName, policyType, policyDetails);
  }
  createResource(body: ResourceDto) {
    const { clientName, resourceDetails, ...user } = body;
    return this.keycloakAuthResource.createResource(user, clientName, resourceDetails);
  }
}
