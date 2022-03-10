import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keycloak } from "./keycloak";
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
import { KeycloakClient } from './client';
import { ResourceDto } from '../dto';

@Injectable()
export class KeycloakAuthResource {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createResource(body: ResourceDto, token: string): Promise<any> {
        const { tenantName, clientName, resourceDetails } = body;
        this.kcTenantAdminClient = new KcAdminClient({
            baseUrl: this.config.get('keycloak.server'),
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcTenantAdminClient.setAccessToken(parts[1]);

        const myClient: ClientRepresentation = await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName);

        await this.kcTenantAdminClient.clients.createResource(
            {
                id: myClient.id
            },
            {
                ...resourceDetails,
                scopes: ['string' as ScopeRepresentation]  // remember to replace this
            }
        )

        return 'Resource created successfully';
    };
};