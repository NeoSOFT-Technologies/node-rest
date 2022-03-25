import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { GetUsersInfoDto, UserDetailsDto, UsersQueryDto } from "../dto";
import RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";

@Injectable()
export class KeycloakUser {
    private kcMasterAdminClient: KcAdminClient;

    constructor(
        private keycloak: Keycloak,
        private config: ConfigService) {
        this.kcMasterAdminClient = this.keycloak.kcMasterAdminClient
        this.keycloakServer = this.config.get('keycloak.server');
    }
    keycloakServer: string;

    public async createAdminUser(realmName: string, email: string, password: string): Promise<TenantAdminUser> {
        return await this.kcMasterAdminClient.users.create({
            username: 'tenantadmin',
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

    public async findUser(client: KcAdminClient): Promise<UserRepresentation> {
        const users = await client.users.find();
        const admin = users.filter((user) => user.username === 'tenantadmin');
        return admin[0];
    };

    public async createUser(user: { tenantName: string }, userDetails: UserDetailsDto, token: string): Promise<string> {
        const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: user.tenantName
        });
        const parts = token.split(' ')
        kcTenantAdminClient.setAccessToken(parts[1]);


        const createdUser = await kcTenantAdminClient.users.create({
            username: userDetails.userName,
            email: userDetails.email,
            enabled: true,
            credentials: [{
                temporary: false,
                type: 'password',
                value: userDetails.password,
            }]
        });

        for (const role of userDetails.roles) {
            const userRole: RoleRepresentation = await this.createUserRole(kcTenantAdminClient, role)
            await this.userRoleMapping(kcTenantAdminClient, createdUser, userRole)
        };

        return 'User created successfully';
    };

    public async getUsers(data: { query: UsersQueryDto, token: string }): Promise<{ data: any, count: number }> {
        let { tenantName, userName = undefined, page = 1 } = data.query;
        const { token } = data;
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const users = await kcClient.users.find({
            briefRepresentation: true,
            username: userName,
            first: (page - 1) * 10,
            max: 10
        });

        const userNames = users.map(user => {
            const createdTimestamp = this.formatTimeStamp(user);
            return {
                userName: user.username,
                email: user.email,
                createdTimestamp
            }
        });
        const count = await kcClient.users.count({
            username: userName
        });

        return {
            data: userNames,
            count: count
        };
    };

    public async getUserInfo(query: GetUsersInfoDto, token: string) {
        const { tenantName, userName, clientName } = query;
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const userInfo: UserRepresentation[] = await kcClient.users.find({
            username: userName,
            briefRepresentation: true,
            exact: true
        });
        if (!userInfo[0]) {
            throw new NotFoundException('User not found');
        };
        const createdTimestamp = this.formatTimeStamp(userInfo[0]);
        const roles = await this.getUserRoles(kcClient, { id: userInfo[0].id });
        const permissions = await this.getUserPermission(kcClient, { id: userInfo[0].id }, clientName);
        return {
            ...userInfo[0],
            createdTimestamp,
            tenantName,
            roles,
            permissions
        };
    };

    public async updateUser(tenantName: string, userName: string, userDetails: UserRepresentation, token: string): Promise<string> {
        const kcClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const user: UserRepresentation[] = await kcClient.users.find({
            username: userName,
            exact: true
        });
        if (!user[0]) {
            throw new NotFoundException('User not found');
        };

        await kcClient.users.update(
            {
                id: user[0].id
            },
            {
                ...user[0],
                ...userDetails
            }
        );


        if (userDetails.realmRoles) {
            const updatedRoles = userDetails.realmRoles;
            const currentRoles = await this.getUserRoles(kcClient, { id: user[0].id });

            const addRoles = updatedRoles.filter(role => !currentRoles.includes(role));
            for (const role of addRoles) {
                const userRole: RoleRepresentation = await kcClient.roles.findOneByName({
                    name: role
                });
                if (!userRole) {
                    throw new NotFoundException(`${role} role not found`);
                }
                await this.userRoleMapping(kcClient, { id: user[0].id }, userRole)
            };

            const deleteRoles = currentRoles.filter(role => !updatedRoles.includes(role));
            for (const role of deleteRoles) {
                const userRole: RoleRepresentation = await kcClient.roles.findOneByName({
                    name: role
                });
                await this.deleteRoleMapping(kcClient, { id: user[0].id }, userRole)
            };
        }

        return 'User updated successfully';
    };

    public async deleteUser(tenantName: string, userName: string, token: string): Promise<string> {
        const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName,
        });
        const parts = token.split(' ')
        kcTenantAdminClient.setAccessToken(parts[1]);

        const user: UserRepresentation[] = await kcTenantAdminClient.users.find({
            username: userName,
            exact: true
        });

        if (!user[0]) {
            throw new NotFoundException('User not found');
        };

        await kcTenantAdminClient.users.del({
            id: user[0].id
        });

        return 'User deleted Successfully';
    };

    public async getAdminDetails(userName: string, token: string) {
        const kcAdminClient: KcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: 'master',
        });
        const parts = token.split(' ')
        kcAdminClient.setAccessToken(parts[1]);

        const adminInfo = await kcAdminClient.users.find({
            username: userName,
            briefRepresentation: true,
            exact: true
        })
        const createdTimestamp = this.formatTimeStamp(adminInfo[0]);
        const roles = await this.getUserRoles(kcAdminClient, { id: adminInfo[0].id });
        return {
            ...adminInfo[0],
            createdTimestamp,
            roles,
        };
    };

    private async createUserRole(client: KcAdminClient, role: string): Promise<RoleRepresentation> {
        let userRole = await client.roles.findOneByName({
            name: role
        });
        if (!userRole) {
            await client.roles.create({
                name: role
            });

            userRole = await client.roles.findOneByName({
                name: role
            });
        }
        return userRole;
    };

    private async userRoleMapping(client: KcAdminClient, createdUser: { id: string }, userRole: RoleRepresentation): Promise<void> {
        await client.users.addRealmRoleMappings({
            id: createdUser.id,
            roles: [
                {
                    id: userRole.id,
                    name: userRole.name,
                },
            ]
        });
    };

    private async deleteRoleMapping(client: KcAdminClient, user: { id: string }, userRole: RoleRepresentation): Promise<void> {
        await client.users.delRealmRoleMappings({
            id: user.id,
            roles: [
                {
                    id: userRole.id,
                    name: userRole.name,
                },
            ]
        });
    };

    private async getUserRoles(client: KcAdminClient, user: { id: string }): Promise<string[]> {
        const roles = await client.users.listRealmRoleMappings({
            id: user.id
        });
        const rolesName = roles.map(role => role.name)
        return rolesName;
    };

    private async getUserPermission(Kcclient: KcAdminClient, user: { id: string }, clientName: string) {
        const client = await Kcclient.clients.find({
            clientId: clientName
        });

        let evaluation: any = await Kcclient.clients.evaluateResource(
            {
                id: client[0].id,
            },
            {
                userId: user.id,
                entitlements: false,
                context: {
                    attributes: {}
                }
            }

        );

        evaluation = evaluation.results;
        let permissions: string[] = [];
        for (let elements of evaluation) {
            if (elements.status === 'PERMIT') {
                elements = elements.policies;
                let c = elements.map((element: any) => element.policy.name)
                permissions.push(...c);
            }
        }
        return permissions;
    };

    private formatTimeStamp(user: UserRepresentation): string {
        const d = new Date(user.createdTimestamp);
        const createdTimestamp = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 19)
            .replace(/-/g, '/')
            .replace('T', ' ');

        return createdTimestamp;
    };
}
