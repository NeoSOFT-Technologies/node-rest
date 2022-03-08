import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KeycloakClient } from "./client";
import { KeycloakUser } from "./keycloakUser"; 
import { Keycloak } from "./keycloak"
import { TenantCredentialsDto } from "@app/dto";
import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";

@Injectable()
export class KeycloakAuthPermission{
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private keycloakClient: KeycloakClient,
        private keycloakUser: KeycloakUser,
        private config: ConfigService
    ){ }

    public async createPermission(user: TenantCredentialsDto, clientName: string, permissionType: string, permissionDetails: PolicyRepresentation): Promise<any> {
        try{
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);

            await this.kcTenantAdminClient.clients.createPermission(
                {
                    id: (await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName)).id,
                    type: permissionType
                },
                {
                    ...permissionDetails,
                }
            );
            return "Permission created successfully";
        }catch(error){
            throw error;
        }
    }
}