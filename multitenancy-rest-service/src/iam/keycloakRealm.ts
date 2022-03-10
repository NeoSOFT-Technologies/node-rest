import { Realm } from "@app/dto/realm.dto";
import { Injectable } from "@nestjs/common";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { ConfigService } from "@nestjs/config";
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";
import { KeycloakUser } from "./keycloakUser";


@Injectable()
export class KeycloakRealm {
    private kcMasterAdminClient: KcAdminClient;

    constructor(
        private keycloak: Keycloak,
        private keycloakUser: KeycloakUser,
        private config: ConfigService) {
        this.kcMasterAdminClient = keycloak.kcMasterAdminClient
    }

    public async createRealm(realmName: string, email: string, password: string, token: string): Promise<any> {
        const parts = token.split(' ')
        this.kcMasterAdminClient.setAccessToken(parts[1]);

        const tenantRealm: Realm = await this.createTenantRealm(realmName);
        const adminUser: TenantAdminUser = await this.keycloakUser.createAdminUser(realmName, email, password);
        const adminRole: RoleRepresentation = await this.createAdminRealmRole(tenantRealm);
        await this.createCompositeRole(tenantRealm, adminRole);
        await this.RealmRoleMapping(tenantRealm, adminUser, adminRole);
        return 'Realm created successfully';
    };

    private async createTenantRealm(realmName: string): Promise<Realm> {
        return await this.kcMasterAdminClient.realms.create({
            id: realmName,
            realm: realmName,
            enabled: true
        });
    };

    private async createAdminRealmRole(realm: Realm): Promise<RoleRepresentation> {
        await this.kcMasterAdminClient.roles.create({
            name: 'tenantadmin',
            realm: realm.realmName
        });
        return await this.kcMasterAdminClient.roles.findOneByName({
            name: 'tenantadmin',
            realm: realm.realmName
        });
    };

    private async RealmRoleMapping(realm: Realm, adminUser: TenantAdminUser, adminRole: RoleRepresentation): Promise<void> {
        await this.kcMasterAdminClient.users.addRealmRoleMappings({
            id: adminUser.id,
            roles: [
                {
                    id: adminRole.id,
                    name: adminRole.name,
                },
            ],
            realm: realm.realmName
        });
    };

    private async createCompositeRole(realm: Realm, adminRole: RoleRepresentation): Promise<void> {
        const clients = await this.kcMasterAdminClient.clients.find({
            realm: realm.realmName
        });
        const realm_management_client = clients.filter((client) => client.clientId === 'realm-management');
        const realm_management_roles = await this.kcMasterAdminClient.clients.listRoles({
            id: realm_management_client[0].id,
            realm: realm.realmName
        });
        await this.kcMasterAdminClient.roles.createComposite({ roleId: adminRole.id, realm: realm.realmName }, realm_management_roles);
    };
};