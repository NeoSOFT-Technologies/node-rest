import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import jwt_decode from "jwt-decode";
import { ConfigService } from "@nestjs/config";
import { CredentialsDto, LogoutDto, RefreshAccessTokenDto } from "@app/dto";
import { httpClient } from "@app/utils";

@Injectable()
export class AuthService {
    constructor(private config: ConfigService) {
        this.keycloakServer = this.config.get('keycloak.server');
    }

    tokenURL: string;
    logoutURL: string;
    validateURL: string;
    keycloakServer: string;

    async getAccessToken(body: CredentialsDto) {
        let { username, password, tenantName, clientId, clientSecret } = body;

        if (!tenantName && !clientId && !clientSecret) {
            tenantName = 'master'
            clientId = 'admin-cli'
        }

        if (!username && clientId && clientSecret) {
            username = 'tenantadmin'
        }

        this.tokenURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/token`;
        const params: string = stringify({
            username,
            password,
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
        });
        const headers = {
            "content-type": "application/x-www-form-urlencoded",
        };

        const response = await httpClient.post({
            url: this.tokenURL,
            payload: params,
            headers: headers
        });
        return response;
    }

    async logout(body: LogoutDto) {
        let { tenantName, refreshToken, clientId, clientSecret } = body;
        if (tenantName === 'master' && !clientId && !clientSecret) {
            clientId = 'admin-cli'
        }

        this.logoutURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/logout`;
        const params = stringify({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        });

        const headers = {
            "content-type": "application/x-www-form-urlencoded",
        }

        const response = await httpClient.post({
            url: this.logoutURL,
            payload: params,
            headers: headers
        })
        return response.status;
    }

    async refreshAccessToken(body: RefreshAccessTokenDto) {
        let { tenantName, refreshToken, clientId, clientSecret } = body;
        if (tenantName === 'master' && !clientId && !clientSecret) {
            clientId = 'admin-cli'
        }

        this.tokenURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/token`;
        const params: string = stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
        });
        const headers = {
            "content-type": "application/x-www-form-urlencoded",
        };

        const response = await httpClient.post({
            url: this.tokenURL,
            payload: params,
            headers: headers
        });
        return response;
    }

    async validateToken(token: string, clientId: string, clientSecret: string) {
        const { iss }: any = jwt_decode(token);

        this.validateURL = `${iss}/protocol/openid-connect/token/introspect`;
        const params = stringify({
            token,
            client_id: clientId,
            client_secret: clientSecret,
        });
        const headers = {
            "content-type": "application/x-www-form-urlencoded",
        }

        const response = await httpClient.post({
            url: this.validateURL,
            payload: params,
            headers: headers
        })
        return response.data.active;
    }

    async getTenantName(token: string) {
        const { iss }: any = jwt_decode(token);
        return iss.split("/").pop();
    }

    async getExpTime(token: string) {
        const { exp }: any = jwt_decode(token);
        return exp;
    }

    async getUserRoles(token: string) {
        const parts = token.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
        const { realm_access }: any = jwt_decode(token);

        let roles: string[] = [];
        if (realm_access.roles) {
            roles = realm_access.roles;
        }
        return roles;
    }
}
