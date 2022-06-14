import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { ScopeDto } from '../dto';
import { KeycloakClient } from './client';

@Injectable()
export class KeycloakAuthScope {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private readonly keycloakClient: KeycloakClient,
        private readonly config: ConfigService
    ) { }

    public async createScope(body: ScopeDto, token: string): Promise<any> {
        const { tenantName, clientName, scopeDetails } = body;
        this.kcTenantAdminClient = new KcAdminClient({
            baseUrl: this.config.get('keycloak.server'),
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcTenantAdminClient.setAccessToken(parts[1]);

        await this.kcTenantAdminClient.clients.createAuthorizationScope(
            {
                id: (await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName)).id
            },
            scopeDetails
        );
        return 'Scope created successfully';
    }
}
