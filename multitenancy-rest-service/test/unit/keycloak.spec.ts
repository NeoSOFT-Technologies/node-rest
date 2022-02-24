import { Test, TestingModule } from '@nestjs/testing';
import { Keycloak } from '@app/iam';
import { ConfigModule } from '@nestjs/config';
import config from '@app/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';

jest.mock('@keycloak/keycloak-admin-client', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                auth: jest.fn(),
            };
        })
    };
});

describe('Testing KeyCloak Service', () => {
    let keycloak: Keycloak;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: [`${process.cwd()}/config/.env`],
                    isGlobal: true,
                    expandVariables: true,
                    load: config,
                }),
            ],
            providers: [Keycloak],
        }).compile();

        keycloak = module.get<Keycloak>(Keycloak);
    });

    it('Testing "init" method', async () => {
        const kcAdminClient = new KcAdminClient();
        const mockauth = jest.spyOn(kcAdminClient, 'auth');
        await keycloak.init('username', 'password', kcAdminClient)
        expect(mockauth ).toHaveBeenCalled()
    });
});
