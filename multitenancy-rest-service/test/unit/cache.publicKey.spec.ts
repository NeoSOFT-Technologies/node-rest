import { Test, TestingModule } from '@nestjs/testing';
import { PublicKeyCache } from '@app/auth/cache.publicKey';
import * as jwksClient from "jwks-rsa";

jest.mock('jsonwebtoken', () => ({
    decode: jest.fn().mockReturnValue({
        header: {
            kid: 'kid'
        },
        iss: 'issuer',
    })
}));

describe('Testing Public Key Caching', () => {
    let publicKeyCache: PublicKeyCache;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PublicKeyCache],
        }).compile();

        publicKeyCache = module.get<PublicKeyCache>(PublicKeyCache);
    });

    it('Testing "getPublicKey"', async () => {
        const token = 'token'
        const mockKey = jest.spyOn(jwksClient.JwksClient.prototype, 'getSigningKey').mockImplementation(() => {
            return Promise.resolve({
                getPublicKey: jest.fn().mockReturnValue('key')
            })
        });

        const response = await publicKeyCache.getPublicKey(token);
        expect(response).toEqual('key');
        mockKey.mockRestore();
    });
});
