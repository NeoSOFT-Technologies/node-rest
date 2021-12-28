# Tenant Config Service

## Introduction

The Tenant Configuration Service is the microservice which is particularly created in order to store the configuration of the specific tenant. This microservice is connected with tenant-master service and tenant-provisioning service, so whenever tenant-provisioning service creates a new database for the tenant then at the time the configuration of the new tenant are stored in the database with the help tenant-config service.

## Installation
- First navigate into the tenant-config-service directory
    ```
    $ cd tenant-config-service
    ```
- Then in order to install the dependencies from `package.json` run the following   command
  ```
  $ npm install
  ```
  
 Once all the dependencies are installed then our microservice is ready to use and we can configure it according to our requirement.
 
 ## Services provided by Tenant Config
 - setConfig: Setting configuration of the new tenant.
 - getConfig: Getting configuration of the required tenant.

## Database Connection
Database connection is done with the help of creating a database module in `database.module.ts` file.
```
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('db.host'),
        port: config.get('db.port'),
        username: config.get('db.username'),
        password: config.get('db.password'),
        database: config.get('db.database'),
        entities: [TenantConfig],
        synchronize: true,
      }),
    }),
  ],
})
```
- We will be using **Mysql** database in order to store the config of the tenant.
- The essential values such as host, port, username, password have all been defined in the .env file present in the **config** folder in the root directory.
- We will be using [TypeORM](https://docs.nestjs.com/recipes/sql-typeorm) in order to create table which is done in the form of entity.
- We should add the column names as show below with specifying its database.

```
@Entity()
export class TenantConfig {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tenantId: number;

  @Column()
  tenantName: string;

  @Column()
  description: string;
....
```
### Tenant Config Controller
```
  @EventPattern({ cmd: 'set_config' })
  async setConfig(tenantconfig: TenantConfigDto) {
    ...
  }

  @MessagePattern({ cmd: 'get_config' })
  async getConfig(tenantId: number) {
    ...
  }
```
The tenant config controller is the file in which we can set the configuration of newly created tenant by using the method `setConfig` and in order to retrieve the configuration of a given tenant we have used the function `getConfig`.
From the tenant-config-controller the control execution is proceeded to the tenant-config-service.

## Tenant Config Service
This service helps to save the tenant config and also help in retrieving the tenant config from the database.

### Bootstrap the microservice
This bootstraps the whole application to start the tenant registration microservice

```ts
# main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.connectMicroservice(transportOptions(config));
  await app.startAllMicroservices();
}

# src/transport/transport.ts
export const transportOptions = (config: ConfigService) => {
  return {
    transport: Transport.TCP,
    options: {
      host: config.get('microservice.host'),
      port: config.get('microservice.port'),
    },
  };
};
```

### Starting the microservice
Since we have dockerised the microservice there is no need for explicitly starting the microservice. But if we need to start then we have to run the following command.
```bash
$ npm run start
``` 