import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import * as jwt from "jsonwebtoken";
import * as jwksClient from "jwks-rsa";
import { ConfigService } from "@nestjs/config";
import { CredentialsDto, LogoutDto, RefreshAccessTokenDto } from "@app/dto";
import { httpClient } from "@app/utils";
import { Role } from "../utils/enums";

@Injectable()
export class AuthService {
    constructor(private readonly config: ConfigService) {
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

        return await httpClient.post({
            url: this.tokenURL,
            payload: params,
            headers: headers
        });
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

        return await httpClient.post({
            url: this.tokenURL,
            payload: params,
            headers: headers
        });
    }

    async validateToken(token: string, clientId: string, clientSecret: string) {
        const { iss }: any = jwt.decode(token) as jwt.JwtPayload;

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

    async validateTokenwithKey(token: string, publicKey: string) {
        jwt.verify(token, publicKey);
    }

    async getpublicKey(tenantName: string) {
        const publicKeyURI = `${this.keycloakServer}/realms/${tenantName}/protocol/openid-connect/certs`;
        const client = jwksClient({
            jwksUri: publicKeyURI
        });
        const key = await client.getSigningKey();
        const signingKey = key.getPublicKey();
        return { public_key: signingKey };
    }

    async getTenantName(token: string) {
        token = this.parseToken(token);
        const { iss }: any = jwt.decode(token) as jwt.JwtPayload;
        return iss.split("/").pop();
    }

    async getUserName(token: string) {
        token = this.parseToken(token);
        const { preferred_username }: any = jwt.decode(token) as jwt.JwtPayload;
        return preferred_username;
    }

    async getExpTime(token: string) {
        token = this.parseToken(token);
        const { exp }: any = jwt.decode(token) as jwt.JwtPayload;
        return exp;
    }

    async getRoles(token: string) {
        const { realm_access }: any = jwt.decode(token) as jwt.JwtPayload;

        let roles: string[] = [];
        if (realm_access.roles) {
            roles = realm_access.roles;
        }
        return roles;
    }

    async getPermissions(token: string) {
        token = this.parseToken(token);
        let { permission }: any = jwt.decode(token) as jwt.JwtPayload;
        if (typeof permission === 'string') {
            permission = permission.split(',');
        }
        return permission;
    }

    async checkUserRole(token: string) {
        token = this.parseToken(token);
        const { realm_access }: any = jwt.decode(token) as jwt.JwtPayload;

        let roles: string[] = [];
        if (realm_access.roles) {
            roles = realm_access.roles;
        }
        return roles.includes(Role.r3);
    }
    private parseToken(token: string) {
        const parts = token.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
        return token;
    }
}
