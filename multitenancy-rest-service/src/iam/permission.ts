import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KeycloakClient } from "./client";
import { PermissionDto } from '../dto';

@Injectable()
export class KeycloakAuthPermission {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createPermission(body: PermissionDto, token: string): Promise<any> {
        const { tenantName, clientName, permissionType, permissionDetails } = body;
        this.kcTenantAdminClient = new KcAdminClient({
            baseUrl: this.config.get('keycloak.server'),
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcTenantAdminClient.setAccessToken(parts[1]);


        await this.kcTenantAdminClient.clients.createPermission(
            {
                id: (await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName)).id,
                type: permissionType
            },
            permissionDetails
        );
        return "Permission created successfully";
    }
}