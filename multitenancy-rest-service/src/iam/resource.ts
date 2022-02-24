import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { TenantUserDto } from '@app/dto/tenant.user.dto';
import { ConfigService } from '@nestjs/config';
import { Keycloak } from "./keycloak";
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
import { KeycloakClient } from './client';

@Injectable()
export class KeycloakAuthResource {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createResource(user: TenantUserDto, clientName: string, resourceDetails: ResourceRepresentation): Promise<any> {
        try {
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);
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
        } catch (error) {
            throw error;
        }
    };
};