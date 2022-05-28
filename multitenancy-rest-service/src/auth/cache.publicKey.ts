import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as jwksClient from "jwks-rsa";

@Injectable()
export class PublicKeyCache {
    private readonly millisecondsToLive: number;
    private cache: Record<string, any> = {};
    private kid: string;
    private readonly minutesToLive = 10;

    constructor() {
        this.millisecondsToLive = this.minutesToLive * 60 * 1000;
    }

    isCacheExpired() {
        return (this.cache[this.kid].date.getTime() + this.millisecondsToLive) < new Date().getTime();
    }
    async getPublicKey(token: string) {
        this.kid = this.getkid(token)
        if (!this.cache[this.kid] || this.isCacheExpired()) {
            const data = await this.fetchPublicKey(token);
            this.cache[this.kid] = {
                key: data,
                date: new Date()
            };
            return data;
        } else {
            return Promise.resolve(this.cache[this.kid].key);
        }
    }

    private async fetchPublicKey(token: string) {
        const { iss }: any = jwt.decode(token) as jwt.JwtPayload;
        const client = jwksClient({
            jwksUri: `${iss}/protocol/openid-connect/certs`
        });
        const key = await client.getSigningKey(this.kid);       
        return key.getPublicKey();
    }

    private getkid(token: string) {
        const { header } = jwt.decode(token, { complete: true });
        return header.kid;
    }
}
