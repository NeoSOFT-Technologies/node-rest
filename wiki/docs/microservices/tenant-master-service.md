# Tenant-Master-Service

## Introduction
Tenant master service is a microservice that is written in order to keep a eye on all the microservices that are present inside the microservice boilerplate. In simple words it can be defined as a centre of communication of all the available microservices such as tenant-config service, tenant provisioning etc.

## Installation
- First navigate into the tenant-master-service directory
    ```
    $ cd tenant-master-service
    ```
- Then in order to install the dependencies from `package.json` run the following   command
  ```
  $ npm install
  ```
  
 Once all the dependencies are installed then our microservice is ready to use and we can configure it according to our requirement.
 
 First we need to configuere the `.env` file which is present in the `config` folder in the tenant-master-service directory.
 ```
MICRO_SERVICE_HOST=tenant-master-service
MICRO_SERVICE_PORT=8847
CLIENT1_HOST=tenant-provisioning
CLIENT2_HOST=tenant-config-service
 ```
 
 `MICRO_SERVICE_HOST:   `The hostname to which the specified microservice is connected
 
 `MICRO_SERVICE_PORT:   `The port number to which the microservice is connected.
 
 `CLIENT1_HOST:     `The name of the first client host.
 
 `CLIENT2_HOST:     `The name of the second client host.
 
 ### tenant.master.service.ts
 ```
   async masterTenantService(tenantDetails: TenantDetailsDto) {
    const tenant = {
      tenantName: tenantDetails.tenantName,
      password: tenantDetails.password,
    };

    const message = this.client1.send({ cmd: 'create-database' }, tenant);
    const databaseName: string = await new Promise((res, rej) => {
      message.subscribe((next) => {
        res(next.database_name);
      });
    });

    const Tenantconfig: TenantDetailsDto = {
      ...tenantDetails,
      tenantDbName: databaseName,
      host: '127.0.0.1',
      port: 3306,
    };
    this.client2.emit({ cmd: 'set_config' }, Tenantconfig);
 ```
 The above piece of code tells that the tenant master service is trying to communicate with the tenant config service by sending the config details of the tenant whose database is getting created.
 
 The controller with the message handler based on request-response paradigm. This is important for this service to communicate with tenant-config microservice and tenant-provisioning microservice.
 
 ```ts
# tenantprovision.module.ts
  @EventPattern({ cmd: 'tenant-master' })
  async masterTenantService(tenantDetails: TenantDetailsDto) {
    try {
     await this.tenantMasterService.masterTenantService(tenantDetails);
    } catch (e) {
      return e;
    }
  }
    ...
```

- `@EventPattern` is used because there is only one way communication between the microservices.
- While the request-response method is ideal for exchanging messages between services, it is less suitable when your message style is event-based - when you just want to publish events without waiting for a response.
- In that case, you do not want the overhead required by request-response for maintaining two channels.

### Starting the microservice
Since we have dockerised the microservice there is no need for explicitly starting the microservice. But if we need to start then we have to run the following command.
```bash
$ npm run start
```