import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { TenantCredentialsDto, UserDetailsDto, UsersQueryDto } from "../dto";
import RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { httpClient } from "../utils";


@Injectable()
export class KeycloakUser {
    private kcMasterAdminClient: KcAdminClient;

    constructor(
        private keycloak: Keycloak,
        private config: ConfigService) {
        this.kcMasterAdminClient = keycloak.kcMasterAdminClient
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

    public async createUser(user: TenantCredentialsDto, userDetails: UserDetailsDto): Promise<any> {
        try {
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, kcTenantAdminClient);

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
                baseUrl: this.config.get('keycloak.server'),
                realmName: tenantName,
            });
            const parts = token.split(' ')
            kcTenantAdminClient.accessToken = parts[1];

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

    private async createUserRole(client: KcAdminClient): Promise<RoleRepresentation> {
        await client.roles.create({
            name: 'user'
        });
        return await client.roles.findOneByName({
            name: 'user'
        });
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