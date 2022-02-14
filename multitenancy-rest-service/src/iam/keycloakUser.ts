import { TenantUserDto } from "@app/dto/tenant.user.dto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { TenantAdminUser } from "@app/dto/tenant.adminuser.dto";


@Injectable()
export class KeycloakUser {
    private kcMasterAdminClient: KcAdminClient;
    
    constructor(
        private keycloak: Keycloak,
        private config: ConfigService) {
        this.kcMasterAdminClient = keycloak.kcMasterAdminClient
    }

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

    public async createUser(user: TenantUserDto): Promise<any> {
        try {
            const kcTenantAdminClient: KcAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, kcTenantAdminClient);

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
}