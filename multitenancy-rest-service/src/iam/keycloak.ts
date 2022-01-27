import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { TenantUserDto } from '../dto/tenant.user.dto';

@Injectable()
export class Keycloak {
    private kcAdminClient: KcAdminClient = new KcAdminClient({
        baseUrl: process.env.KEYCLOAK_SERVER
    });

    private async init(): Promise<void> {
        await this.kcAdminClient.auth({
            username: process.env.KEYCLOAK_ADMIN_USER,
            password: process.env.KEYCLOAK_ADMIN_PASSWORD,
            grantType: 'password',
            clientId: 'admin-cli',
        });
    };

    public async createRealm(realmName:string): Promise<any> {
        try {
            await this.init();
            return await this.kcAdminClient.realms.create({
                id: realmName,
                realm: realmName
            });
        } catch (error) {
            return error;
        }
    };

    public async createUser(user:TenantUserDto): Promise<any> {
        try {
            await this.init();
            return await this.kcAdminClient.users.create({
                username: user.userName,
                email: user.email,
                attributes: {
                    key: 'value',
                },
                realm: user.tenantName
            });
        } catch (error) {
            return error;
        }
    };
};


// await kcAdminClient.users.addClientRoleMappings

// return await this.kcAdminClient.users.create({
            //     username: 'userName',
            //     email: 'abc@email.com',
            //     attributes: {
            //         key: 'value',
            //     }
            // });
            // const currentRealm = await this.kcAdminClient.clients.findOne({
            //     realm : 'realmName'
            // })
            // console.log(currentRealm);
            // return currentRealm;
            
            // const currentUser = await this.kcAdminClient.users.create({
            //     username: 'userName',
            //     email: 'abc@email.com',
            //     attributes: {
            //         key: 'value',
            //     },
            //     realm: 'realmName'
            // });
            // console.log('this.currentRealm.id: ',this.currentRealm.id);
            
            // const role = await this.kcAdminClient.clients.findRole({
            //     id: this.currentRealm.id,
            //     roleName: 'manage-users'
            // })

            // return await this.kcAdminClient.users.addClientRoleMappings({
            //     id: currentUser.id,
            //     clientUniqueId: '47e1f0c1-dc4f-4ecc-8c19-3e314d5ec2c5',
            //     roles: [
            //         {
            //             id: role.id,
            //             name: role.name
            //         }
            //     ]
            // })


    // private async init(username,password): Promise<void> {
    //     await this.kcAdminClient.auth({
    //         username: username,
    //         password: password,
    //         grantType: 'password',
    //         clientId: 'admin-cli',
    //     });
    // };

            // await this.init();
            // const currentUser = await this.kcAdminClient.users.create({
            //     username: 'userName',
            //     email: 'abc@email.com',
            //     attributes: {
            //         key: 'value',
            //     }
            // });
            // return await this.kcAdminClient.users.addClientRoleMappings({
            //     id: currentUser.id,
            //     clientUniqueId: '1d096cac-a620-4dfb-9f85-1466cd1762ba',
            //     roles: [
            //         {
            //             id: '4436aed9-15a6-4572-b676-19ef6163e174',
            //             name: 'manage-realm'
            //         }
            //     ]
            // })

                        // return await this.kcAdminClient.clients.findRole({
            //     id: '1d096cac-a620-4dfb-9f85-1466cd1762ba',
            //     roleName: 'manage-realm'
            // })


