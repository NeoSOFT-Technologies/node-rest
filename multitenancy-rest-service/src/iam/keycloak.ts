import KcAdminClient from '@keycloak/keycloak-admin-client';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { Injectable } from '@nestjs/common';
import { TenantUserDto } from '../dto/tenant.user.dto';

@Injectable()
export class Keycloak {
    public async createRealm(realmName: string, email: string, password: string): Promise<any> {
        try {
            const adminUsername = process.env.KEYCLOAK_ADMIN_USER;
            const adminUserpassword = process.env.KEYCLOAK_ADMIN_PASSWORD;

            await this.init(adminUsername, adminUserpassword, this.kcMasterAdminClient);

            const tenantRealm = await this.createTenantRealm(realmName);
            const adminUser = await this.createAdminUser(realmName, email, password);
            const adminRole = await this.createAdminRealmRole(tenantRealm);
            await this.createCompositeRole(tenantRealm, adminRole);
            await this.RealmRoleMapping(tenantRealm, adminUser, adminRole);
            return 'Realm created successfully';
        } catch (error) {
            return error;
        }
    };

    public async createUser(user: TenantUserDto): Promise<any> {
        try {
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: process.env.KEYCLOAK_SERVER,
                realmName: user.tenantName
            });

            await this.init('adminuser', user.password, kcTenantAdminClient);

            await kcTenantAdminClient.users.create({
                username: user.userName,
                email: user.email,
                realm: user.tenantName
            });
            return 'User created successfully';
        } catch (error) {
            return error;
        }
    };

    private kcMasterAdminClient: KcAdminClient = new KcAdminClient({
        baseUrl: process.env.KEYCLOAK_SERVER,
    });

    private async init(username: string, password: string, client: KcAdminClient): Promise<void> {
        await client.auth({
            username: username,
            password: password,
            grantType: 'password',
            clientId: 'admin-cli',
        });
    };

    private async createTenantRealm(realmName: string) {
        return await this.kcMasterAdminClient.realms.create({
            id: realmName,
            realm: realmName,
            enabled: true
        });
    };

    private async createAdminUser(realmName: string, email: string, password: string) {
        return await this.kcMasterAdminClient.users.create({
            username: 'adminuser',
            email: email,
            enabled: true,
            credentials: [{
                temporary: false,
                type: 'password',
                value: password,
            }],
            realm: realmName
        });
    };

    private async createAdminRealmRole(realm: { realmName: string }) {
        await this.kcMasterAdminClient.roles.create({
            name: 'admin',
            realm: realm.realmName
        });
        return await this.kcMasterAdminClient.roles.findOneByName({
            name: 'admin',
            realm: realm.realmName
        });
    };

    private async RealmRoleMapping(realm: { realmName: string }, adminUser: { id: string }, adminRole: RoleRepresentation) {
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

    private async createCompositeRole(realm: { realmName: string }, adminRole: RoleRepresentation) {
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