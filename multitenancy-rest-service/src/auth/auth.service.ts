import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import axios from "axios";
import jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {
    tokenURL: string;
    logoutURL: string;
    validateURL: string;
    clientId: string = '';
    clientSecret: string = '';

    keycloakServer = process.env.KEYCLOAK_SERVER;

    async getAccessToken(query) {
        const {credentials, tenantName, clientId, clientSecret} = query;
        this.tokenURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/token`;
        this.clientId = clientId;
        this.clientSecret =clientSecret;
        const params: string = stringify({
            username: credentials.username,
            password: credentials.password,
            grant_type: 'password',
            client_id: clientId,
            client_secret: this.clientSecret,
        });
        const headers = {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            }
        }
        const response = await axios.post(this.tokenURL, params, headers);
        return {
            data: response.data
        };
    }
    
    async logout(params) {
        const {tenantName} = params;
        const query = stringify({
            redirect_uri: 'http://logout URI'
        });

        this.logoutURL = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/logout/${query}`;
        const response = await axios.get(this.logoutURL);
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
