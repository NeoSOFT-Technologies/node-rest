import { Injectable } from "@nestjs/common";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Keycloak {
    constructor(private config: ConfigService) { }

    public kcMasterAdminClient: KcAdminClient = new KcAdminClient({
        baseUrl: this.config.get('keycloak.server'),
    });

    public async init(username: string, password: string, client: KcAdminClient): Promise<void> {
        await client.auth({
            username: username,
            password: password,
            grantType: 'password',
            clientId: 'admin-cli',
        });
    };
};