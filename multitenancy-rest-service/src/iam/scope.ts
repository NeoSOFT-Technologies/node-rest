import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Keycloak } from "./keycloak";
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { TenantCredentialsDto } from '@app/dto';
import { KeycloakClient } from './client';
import { ScopeRepresentationDto } from '@app/dto/scope.representation.dto';

@Injectable()
export class KeycloakAuthScope{

    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private keycloakClient: KeycloakClient,
        private config: ConfigService
    ) { }

    public async createScope(user: TenantCredentialsDto, clientName: string, scopeDetails:ScopeRepresentationDto): Promise<any>{
        try{
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });
            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);

            await this.kcTenantAdminClient.clients.createAuthorizationScope(
                {
                    id: (await this.keycloakClient.findClient(this.kcTenantAdminClient, clientName)).id
                },
                scopeDetails
            );
            return 'Scope created Successfully';

        } catch(error){
            throw error;
        }
    }
};