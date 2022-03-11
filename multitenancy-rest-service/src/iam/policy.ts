import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Logic } from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PolicyDto } from '../dto';
import { KeycloakClient } from './client';
import { KeycloakUser } from "./keycloakUser";



@Injectable()
export class KeycloakAuthPolicy {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloakUser: KeycloakUser,
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createPolicy(body: PolicyDto, token: string): Promise<any> {
        const { tenantName, clientName, policyType, policyDetails } = body;
        this.kcTenantAdminClient = new KcAdminClient({
            baseUrl: this.config.get('keycloak.server'),
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcTenantAdminClient.setAccessToken(parts[1]);

        await this.kcTenantAdminClient.clients.createPolicy(
            {
                id: (await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName)).id,
                type: policyType
            },
            {
                ...policyDetails,
                logic: Logic.POSITIVE,
                users: [(await this.keycloakUser.findUser(this.kcTenantAdminClient)).id]
            }
        )

        return 'Policy created successfully';
    };
};