# Tenant-Provisioning

This microservice provisions a separeate database to the tenant which the tenant has access to through the email and password provided during registration. This database can then be used by tenant as per their requirement.

### Installation
First run this command to install all dependency
```bash
$ npm install
```
### Connection to database server
For this we use [mysql client](https://www.npmjs.com/package/mysql2) for Node.js which supports prepared statements, non-utf8 encodings, binary log protocol, compression, ssl much more

```ts
export const getConnection = (config: ConfigService) => {
  const db_connection = mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.username'),
    password: config.get('db.password'),
    multipleStatements: true,
  });
  db_connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('connected');
  });

  return db_connection;
};
``` 
`host:  ` The hostname of the database to connect to
`user:  ` The MySQL user to authenticate as
`password:  ` The password of that MySQL user
`multipleStatements:  ` Allow multiple mysql statements per query. (Default: false)

### SQL script for creating database
```sql
CREATE DATABASE ??;
```
### Provision database service
The SQL script is read to create the database for the tenant

```ts
# tenantprovision.service.ts
export class TenantprovisionService {
  constructor(private config: ConfigService) {}

  private db_connection = getConnection(this.config);

  async createDatabase(tenant_name: ProvisionTenantDto) {
    const query = readFileSync(
      `${__dirname}/scripts/create-database.sql`,
    ).toString();

    return await new Promise((res, rej) => {
      if (query) {
        this.db_connection.query(
          query,
          ['db-' + tenant_name.tenantName],
          (err) => {
            if (err) {
              rej(err);
            } else {
              res({
                status: 'Database created successfully',
                database_name: 'db-' + tenant_name.tenantName,
              });
            }
          },
        );
      }
    });
  }
```

### Controller
The controller with the message handler based on request-response paradigm. This is important for this service to communicate with tenant-master microservice

```ts
# tenantprovision.module.ts
    @MessagePattern({ cmd: 'create-database' })
    async createDatabase(tenant_name: ProvisionTenantDto) {
        try {
        return await this.provisionService.createDatabase(tenant_name);
        } catch (e) {
        return e;
        }
    }
    ...
```
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
### Start the Microservice
```bash
$ npm run start
```