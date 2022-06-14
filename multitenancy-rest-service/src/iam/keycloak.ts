import { Injectable } from "@nestjs/common";
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Keycloak {
    constructor(private readonly config: ConfigService) { }

    public kcMasterAdminClient: KcAdminClient = new KcAdminClient({
        baseUrl: this.config.get('keycloak.server'),
    });
}
