# Tenant-Registration

This microservice is responsible for registering a new tenant using tenant's details. The details are first checked for duplication.These details are then stored in the tenant config table before being sent to the Tenant master service for separate database provision for that tenant.


### Installation
First run this command to install all dependency
```bash
$ npm install
```

### Configuration
The database configuration which is going to store tenant details in `tenant_config` table in admin db

```ts
# src/tenant-reg/db/database.module.ts

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
        entities: [Tenant],
        synchronize: true,
      }),
    }),
  ],
})
```
`type:  ` Database type. Must specify which database engine to use.  
`host:  ` Database host.  
`port:  ` Database host port. Default mysql port is 3306  
`username:  ` Database username.  
`password:  ` Database password.  
`database:  ` Database name.  
`entities:  ` Entities that maps with database table. It is shown below  

### Defining Tenant entity

```ts
# src/tenant-reg/entity/tenant.entity.ts

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tenantName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  description: string;

  @Column()
  createdDateTime: string;
  
  @Column({ default: false })
  isDelete: boolean;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;
}
```
### Utility identifier for checking duplication of tenant
This is important to ensure that there is no duplication of tenant with same details
```ts
# src/tenant-reg/identifier/identifier.service.ts
export class IdentifierService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async identify(tenant: IdentifyTenantDto): Promise<number> {
    return this.tenantRepository.count({
      where: {
        tenantName: tenant.tenantName,
        email: tenant.email,
      },
    });
  }
}
```

### Controller
The controller with the message handler based on request-response paradigm. This is important for this service to communicate through multitenancy-rest-service

```ts
# src/tenant-reg/registertenant.controller.ts
export class RegistertenantController {
  constructor(
    private readonly tenantService: RegistertenantService,
    private readonly identifierService: IdentifierService,
  ) {}

  @MessagePattern({ cmd: 'register-tenant' })
  async registerTenant(tenant: RegisterTenantDto) {
    try {
      if (await this.identifierService.identify(tenant)) {
        return {
          status: 'this tenant already exists',
        };
      }
      return await this.tenantService.register(tenant);
    } catch (e) {
      return e;
    }
  }
}
```
### Saving the tenant details
The tenant details are saved into the `tenant_config` table using typeorm repository function as is shown below

```ts
# src/tenant-reg/registertenant.service.ts
...
    const registered_tenant = await this.tenantRepository.save(tenant);
...
```

### Bootstrap the microservice
This bootstraps the whole application to start the tenant registration microservice

```ts
# src/main.ts
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
Since we have dockerised the microservice there is no need for explicitly starting the microservice. But if we need to start then we have to run the following command.
```bash
$ npm run start
```
