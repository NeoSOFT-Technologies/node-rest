import { Realm } from "@app/dto/realm.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";
import { KeycloakUser } from "./keycloakUser";
import { ConfigService } from "@nestjs/config";
import ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { Role } from "../utils/enums";


@Injectable()
export class KeycloakRealm {
    private readonly kcMasterAdminClient: KcAdminClient;

    constructor(
        private readonly keycloak: Keycloak,
        private readonly keycloakUser: KeycloakUser,
        private readonly config: ConfigService) {
        this.kcMasterAdminClient = this.keycloak.kcMasterAdminClient
        this.keycloakServer = this.keycloakUser.keycloakServer
    }
    keycloakServer: string;
    clientID = 'realm-management';

    public async createRealm(realmName: string, userName: string, email: string, password: string, token: string): Promise<any> {
        const parts = token.split(' ')
        this.kcMasterAdminClient.setAccessToken(parts[1]);

        const tenantRealm: Realm = await this.createTenantRealm(realmName, email);
        const adminUser: TenantAdminUser = await this.keycloakUser.createAdminUser(realmName, userName, email, password);
        const adminRole: RoleRepresentation = await this.createAdminRealmRole(tenantRealm);
        await this.createCompositeRole(tenantRealm, adminRole);
        await this.RealmRoleMapping(tenantRealm, adminUser, adminRole);

        const userRoleDetails = {
            name: 'user',
            composite: true,
            composites: {
                client: {
                    'realm-management': ['view-users', 'view-realm', 'view-clients', 'view-authorization', 'manage-users']
                }
            }
        }
        await this.createRealmRoles(realmName, userRoleDetails, token)
        return 'Realm created successfully';
    }

    public async createRealmRoles(tenantName: string, roleDetails: RoleRepresentation, token: string): Promise<string> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        await kcClient.roles.create(roleDetails);
        return 'Role created successfully';
    }

    public async getRealmRoles(tenantName: string, token: string): Promise<string[]> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const roles = await kcClient.roles.find();
        let rolesName = roles.map(role => role.name)
        rolesName = rolesName.filter(role => {
            return !(role.includes('default-roles') || role.includes('uma') || role.includes('offline_access'));
        })
        return rolesName;
    }

    public async getRealmRoleInfo(tenantName: string, roleName: string, token: string): Promise<RoleRepresentation> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const role = await kcClient.roles.findOneByName({
            name: roleName
        });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    public async updateRealmRoles(tenantName: string, roleName: string, roleDetails: RoleRepresentation, token: string): Promise<string> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const role = await kcClient.roles.findOneByName({
            name: roleName
        });
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        await kcClient.roles.updateByName(
            { name: roleName },
            {
                ...role,
                ...roleDetails
            }
        );

        if (roleDetails.composites) {
            const client = await kcClient.clients.find({
                clientId: this.clientID
            });

            const updatedCompositeRoles = roleDetails.composites.client[this.clientID];
            const compositeRoles = await kcClient.roles.getCompositeRoles({
                id: role.id
            });
            const currentCompositeRoles = compositeRoles.map(r => r.name);

            const addCompositeRoles = updatedCompositeRoles.filter(r => !currentCompositeRoles.includes(r));
            await this.addCompositeRole(kcClient, addCompositeRoles, client[0], role);

            const deleteCompositeRoles = currentCompositeRoles.filter(r => !updatedCompositeRoles.includes(r));
            await this.deleteCompositeRole(kcClient, deleteCompositeRoles, client[0], role);
        }
        return 'Role updated successfully';
    }

    public async deleteRealmRoles(tenantName: string, roleName: string, token: string): Promise<string> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        await kcClient.roles.delByName({
            name: roleName
        });
        return 'Role deleted successfully';
    }


    public async deleteRealm(tenantname: string, token: string): Promise<any> {
        const parts = token.split(' ');
        this.kcMasterAdminClient.setAccessToken(parts[1]);
        await this.kcMasterAdminClient.realms.del({
            realm: tenantname
        });
    }

    private async createTenantRealm(realmName: string, email: string): Promise<Realm> {
        return this.kcMasterAdminClient.realms.create({
            id: realmName,
            realm: realmName,
            enabled: true,
            resetPasswordAllowed: true,
            smtpServer: {
                "host": this.config.get('mailServer.host'),
                "port": this.config.get('mailServer.port'),
                "from": email,
            }
        });
    }

    private async createAdminRealmRole(realm: Realm): Promise<RoleRepresentation> {
        await this.kcMasterAdminClient.roles.create({
            name: Role.r2,
            realm: realm.realmName
        });
        return this.kcMasterAdminClient.roles.findOneByName({
            name: Role.r2,
            realm: realm.realmName
        });
    }

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
    }

    private async createCompositeRole(realm: Realm, adminRole: RoleRepresentation): Promise<void> {
        const clients = await this.kcMasterAdminClient.clients.find({
            realm: realm.realmName
        });
        const RealmManagementClient = clients.filter((client) => client.clientId === this.clientID);
        const RealmManagementRoles = await this.kcMasterAdminClient.clients.listRoles({
            id: RealmManagementClient[0].id,
            realm: realm.realmName
        });
        await this.kcMasterAdminClient.roles.createComposite({ roleId: adminRole.id, realm: realm.realmName }, RealmManagementRoles);
    }

    private async addCompositeRole(kcClient: KcAdminClient, addRoles: string[], client: ClientRepresentation, role: RoleRepresentation) {
        const addCompositeRoles: RoleRepresentation[] = [];
        for (const r of addRoles) {
            const clientRole = await kcClient.clients.findRole({
                id: client.id,
                roleName: r
            });
            if (!clientRole) {
                throw new NotFoundException(`${r} role not found`);
            }
            addCompositeRoles.push(clientRole);
        }

        await kcClient.roles.createComposite(
            { roleId: role.id },
            addCompositeRoles
        )
    }

    private async deleteCompositeRole(kcClient: KcAdminClient, deleteRoles: string[], client: ClientRepresentation, role: RoleRepresentation) {
        const deleteCompositeRoles: RoleRepresentation[] = [];
        for (const r of deleteRoles) {
            const clientRole = await kcClient.clients.findRole({
                id: client.id,
                roleName: r
            });
            if (!clientRole) {
                throw new NotFoundException(`${r} role not found`);
            }
            deleteCompositeRoles.push(clientRole);
        }

        await kcClient.roles.delCompositeRoles(
            { id: role.id },
            deleteCompositeRoles
        )
    }
}
