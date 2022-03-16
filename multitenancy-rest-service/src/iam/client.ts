import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import { ClientDto } from '../dto';

@Injectable()
export class KeycloakClient {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private config: ConfigService
    ) { }

    public async createClient(body: ClientDto, token: string): Promise<{
        clientId: string;
        clientSecret: string;
    }> {
        const { tenantName, clientDetails } = body;
        this.kcTenantAdminClient = new KcAdminClient({
            baseUrl: this.config.get('keycloak.server'),
            realmName: tenantName
        });

        const parts = token.split(' ')
        this.kcTenantAdminClient.setAccessToken(parts[1]);

        await this.kcTenantAdminClient.clients.create(clientDetails);
        const clientSecret = await this.generateSecret(this.kcTenantAdminClient, clientDetails.clientId);

        return {
            clientId: clientDetails.clientId,
            clientSecret
        };
    };

    public async findClient(kcclient: KcAdminClient, clientName: string): Promise<ClientRepresentation> {
        const clients = await kcclient.clients.find();
        const client = clients.filter((client) => client.clientId === clientName);
        return client[0];
    };

    private async generateSecret(kcclient: KcAdminClient, clientName: string): Promise<string> {
        const clients = await kcclient.clients.find();
        const client = clients.filter((client) => client.clientId === clientName);
        const newCredential = await kcclient.clients.generateNewClientSecret(
            {
                id: client[0].id,
            },
        );
        return newCredential.value;
    };

    public defaultClientDetails() {
        return {
            clientId: this.config.get('client.id'),
            rootUrl: this.config.get('client.rootUrl'),
            redirectUris: [`${this.config.get('client.rootUrl')}/*`],
            serviceAccountsEnabled: true,
            authorizationServicesEnabled: true,
            directAccessGrantsEnabled: true
        }
    };
};