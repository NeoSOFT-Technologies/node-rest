import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import jwt_decode from "jwt-decode";
import { ConfigService } from "@nestjs/config";
import { CredentialsDto, LogoutDto } from "../dto";
import { HttpClient } from "../utils";

@Injectable()
export class AuthService {
    constructor(private config: ConfigService) { }

    tokenURL: string;
    logoutURL: string;
    validateURL: string;
    clientId: string = '';
    clientSecret: string = '';

    keycloakServer = this.config.get('keycloak.server');

    async getAccessToken(body: CredentialsDto) {
        const { username, password, tenantName, clientId, clientSecret } = body;
        this.tokenURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/token`;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        const params: string = stringify({
            username,
            password,
            grant_type: 'password',
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const headers = {
                "content-type": "application/x-www-form-urlencoded",
        }

        try {
            const hp = new HttpClient();
            const response = hp.post({
                url: this.tokenURL,
                payload: params,
                headers: headers
            })
            return response;
        } catch (e) {
            throw e
        }
    }

    async logout(body: LogoutDto) {
        const { tenantName, refreshToken } = body;
        this.logoutURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/logout`;
        const params = stringify({
            refresh_token: refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });

        const headers = {
                "content-type": "application/x-www-form-urlencoded",
        }
        try {
            const response = await new HttpClient().post({
                url: this.logoutURL,
                payload: params,
                headers: headers
            })
            return response.status;
        } catch (e) {
            throw e
        }
    }

    async validateToken(token: string) {
        const { iss }: any = jwt_decode(token);

        this.validateURL = `${iss}/protocol/openid-connect/token/introspect`;
        const params = stringify({
            token,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const headers = {
                "content-type": "application/x-www-form-urlencoded",
        }
        try {
            const response = await new HttpClient().post({
                url: this.validateURL,
                payload: params,
                headers: headers
            })
            return response.data.active;
        } catch (e) {
            throw e
        }
    }

    async getUserRoles(token: string) {
        const { realm_access }: any = jwt_decode(token);

        let roles: string[] = [];
        if (realm_access.roles) {
            roles = realm_access.roles;
        }
        return roles;
    }
}
