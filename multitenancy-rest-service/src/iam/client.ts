import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { TenantUserDto } from '@app/dto/tenant.user.dto';
import { ConfigService } from '@nestjs/config';
import { Keycloak } from "./keycloak";
import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';

@Injectable()
export class KeycloakClient {
    private kcTenantAdminClient: KcAdminClient;
    constructor(
        private keycloak: Keycloak,
        private config: ConfigService
    ) { }

    public async createClient(user: TenantUserDto): Promise<any> {
        try {
            this.kcTenantAdminClient = new KcAdminClient({
                baseUrl: this.config.get('keycloak.server'),
                realmName: user.tenantName
            });

            await this.keycloak.init('adminuser', user.password, this.kcTenantAdminClient);
            await this.kcTenantAdminClient.clients.create({
                clientId: 'my-nest-application',
                baseUrl: 'http://localhost:5000',
                authorizationServicesEnabled: true,
                access: {
                    'confidential': true
                }
            })

            return 'Client created successfully';
        } catch (error) {
            return error;
        }
    };

    public async findClient(kcclient: KcAdminClient, clientName: string): Promise<ClientRepresentation> {
        const clients = await kcclient.clients.find();
        const client = clients.filter((client) => client.clientId === clientName);
        return client[0];
    };
};