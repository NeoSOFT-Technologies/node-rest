import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KeycloakClient } from "./client";
import { DeletePermissionDto, PermissionDto, UpdatePermissionDto } from '../dto';

@Injectable()
export class KeycloakAuthPermission {
    private kcAdminClient: KcAdminClient;
    constructor(
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) {
        this.keycloakServer = this.config.get('keycloak.server');
    }
    keycloakServer: string;

    public async createPermission(body: PermissionDto, token: string): Promise<any> {
        const { tenantName, clientName, permissionType, permissionDetails } = body;
        this.kcAdminClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcAdminClient.setAccessToken(parts[1]);


        await this.kcAdminClient.clients.createPermission(
            {
                id: (await this.keycloakClient.findClient(this.kcAdminClient, clientName)).id,
                type: permissionType
            },
            permissionDetails
        );
        return "Permission created successfully";
    }

    public async getPermissions(tenantName: string, clientName: string, token: string) {
        const kcClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName
        });

        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const permissions = await kcClient.clients.findPermissions({
            id: (await this.keycloakClient.findClient(kcClient, clientName)).id,
            name: ''
        });
        return permissions;
    }

    public async updatePermission(body: UpdatePermissionDto, token: string): Promise<string> {
        const { tenantName, clientName, permissionName, permissionType, permissionDetails } = body;
        const kcClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName
        });

        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const client = await kcClient.clients.find({
            clientId: clientName
        });
        const permission = await kcClient.clients.findPermissions({
            id: client[0].id,
            name: permissionName
        });
        await kcClient.clients.updatePermission(
            {
                id: client[0].id,
                type: permissionType,
                permissionId: permission[0].id
            },
            {
                ...permission[0],
                ...permissionDetails
            }
        );
        return "Permission updated successfully";
    }

    public async deletePermission(body: DeletePermissionDto, token: string): Promise<string> {
        const { tenantName, clientName, permissionName, permissionType } = body;
        const kcClient = new KcAdminClient({
            baseUrl: this.keycloakServer,
            realmName: tenantName
        });

        const parts = token.split(' ')
        kcClient.setAccessToken(parts[1]);

        const client = await kcClient.clients.find({
            clientId: clientName
        });
        const permission = await kcClient.clients.findPermissions({
            id: client[0].id,
            name: permissionName
        });
        await kcClient.clients.delPermission({
            id: client[0].id,
            type: permissionType,
            permissionId: permission[0].id
        });
        return "Permission deleted successfully";
    }
}