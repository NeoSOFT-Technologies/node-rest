import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { UserDetailsDto, UsersQueryDto } from "../dto";
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

    public async findUser(client: KcAdminClient): Promise<UserRepresentation> {
        const users = await client.users.find();
        const admin = users.filter((user) => user.username === 'adminuser');
        return admin[0];
    };

    public async createUser(user: { tenantName: string }, userDetails: UserDetailsDto, token: string): Promise<string> {
        try {
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

            const userRole: RoleRepresentation = await this.createUserRole(kcTenantAdminClient)
            await this.UserRoleMapping(kcTenantAdminClient, createdUser, userRole)

            return 'User created successfully';
        } catch (error) {
            throw error;
        }
    };

    public async getUsers(data: { query: UsersQueryDto, token: string }): Promise<{ data: UserRepresentation[], count: number }> {
        try {
            let { tenantName, page = 1 } = data.query;
            const { token } = data;
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: this.keycloakServer,
                realmName: tenantName,
            });
            const parts = token.split(' ')
            kcTenantAdminClient.setAccessToken(parts[1]);

            const users = await kcTenantAdminClient.users.find({
                briefRepresentation: true,
                first: (page - 1) * 5,
                max: 5
            });
            const count = await kcTenantAdminClient.users.count();

            return {
                data: users,
                count
            };

        } catch (error) {
            throw error;
        }
    };

    public async updateUser(tenantName: string, userName: string, userDetails: UserRepresentation, token: string): Promise<string> {
        try {
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: this.keycloakServer,
                realmName: tenantName,
            });
            const parts = token.split(' ')
            kcTenantAdminClient.setAccessToken(parts[1]);

            const user: UserRepresentation[] = await kcTenantAdminClient.users.find({
                username: userName
            });
            if (!user[0]) {
                throw new NotFoundException('User not found');
            };

            await kcTenantAdminClient.users.update(
                {
                    id: user[0].id
                },
                {
                    ...user[0],
                    ...userDetails
                }
            );

            return 'User updated successfully';
        } catch (error) {
            throw error;
        }
    };

    public async deleteUser(tenantName: string, userName: string, token: string): Promise<string> {
        try {
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: this.keycloakServer,
                realmName: tenantName,
            });
            const parts = token.split(' ')
            kcTenantAdminClient.setAccessToken(parts[1]);

            const user: UserRepresentation[] = await kcTenantAdminClient.users.find({
                username: userName
            });

            if (!user[0]) {
                throw new NotFoundException('User not found');
            };

            await kcTenantAdminClient.users.del({
                id: user[0].id
            });

            return 'User deleted Successfully';
        } catch (error) {
            throw error;
        }
    };

    private async createUserRole(client: KcAdminClient): Promise<RoleRepresentation> {
        let userRole = await client.roles.findOneByName({
            name: 'user'
        });
        if (!userRole) {
            console.log('inside if');

            await client.roles.create({
                name: 'user'
            });

            userRole = await client.roles.findOneByName({
                name: 'user'
            });
        }
        return userRole;
    };

    private async UserRoleMapping(client: KcAdminClient, createdUser: { id: string }, userRole: RoleRepresentation): Promise<void> {
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
}