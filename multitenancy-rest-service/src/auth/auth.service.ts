import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private config: ConfigService) { }

    tokenURL: string;
    logoutURL: string;
    validateURL: string;
    clientId: string = '';
    clientSecret: string = '';

    keycloakServer = this.config.get('keycloak.server');

    async getAccessToken(body) {
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
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        }
        const response = await axios.post(this.tokenURL, params, headers);
        return response;
    }

    async logout(body) {
        const { tenantName, refreshToken } = body;        
        this.logoutURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/logout`;
        const params = stringify({
            refresh_token: refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });

        const headers = {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        }
        const response = await axios.post(this.logoutURL, params, headers);
        return response.status;

    }

    async validateToken(token) {
        const { iss }: any = jwt_decode(token);

        this.validateURL = `${iss}/protocol/openid-connect/token/introspect`;
        const params = stringify({
            token,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const headers = {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        }
        const response = await axios.post(this.validateURL, params, headers);
        return response.data.active;
    }

    async getUserRoles(token) {
        const { realm_access }: any = jwt_decode(token);

        let roles: string[] = [];
        if (realm_access.roles) {
            roles = realm_access.roles;
        }
        return roles;
    }
}
