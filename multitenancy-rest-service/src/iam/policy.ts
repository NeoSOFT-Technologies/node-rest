import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { TenantUserDto } from '@app/dto/tenant.user.dto';
import { ConfigService } from '@nestjs/config';
import { Keycloak } from "./keycloak";
import PolicyRepresentation, { Logic } from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import { KeycloakUser } from "./keycloakUser";
import { KeycloakClient } from './client';



@Injectable()
export class KeycloakAuthPolicy {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private keycloakUser: KeycloakUser,
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createPolicy(user: TenantUserDto, clientName: string, policyType: string, policyDetails: PolicyRepresentation): Promise<any> {
        try {
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);

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
        } catch (error) {
            throw error;
        }
    };
};