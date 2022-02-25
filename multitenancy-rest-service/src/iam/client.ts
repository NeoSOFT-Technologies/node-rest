import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keycloak } from "./keycloak";
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import { TenantCredentialsDto } from '@app/dto';

@Injectable()
export class KeycloakClient {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private config: ConfigService
    ) { }

    public async createClient(user: TenantCredentialsDto, clientDetails: ClientRepresentation): Promise<any> {
        try {
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);
            await this.kcTenantAdminClient.clients.create(clientDetails);

            return 'Client created successfully';
        } catch (error) {
            throw error;
        }
    };

    public async findClient(kcclient: KcAdminClient, clientName: string): Promise<ClientRepresentation> {
        const clients = await kcclient.clients.find();
        const client = clients.filter((client) => client.clientId === clientName);
        return client[0];
    };
};