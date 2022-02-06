# Multitenancy Rest Service

This multitenancy-rest-service has been included to interact with the tenant microservices and test its working. It has the following endpoints namely
- `Register tenant` `/api/tenants/` - HTTP POST: It registers a new tenant by consuming tenant-registration microservice.
- `Get All Tenant` `api/tenants/`- HTTP GET: It retreives all the registered tenant information from database.
- `Update Tenant` `/api/tenants`- HTTP PATCH: Sample API to update tenant configuration.
- `Deleting Tenant` `api/tenants` - HTTP DELETE: Sample API to delete a tenant.
- `Tenant Configuration` `/api/tenants/{id}` - HTTP GET: It retrieves configuration of the specified id.
- `/api/user` - HTTP POST: It will create a user under the specified userName
- `/api/connect-database`- HTTP GET: It generates the connection string to a tenant database and connects to it.
- `/api/create-table` - HTTP POST: It creates table in the database of the tenant.

### Installation
First run this command to install all dependency
```bash
$ npm install
```

### Controller
The controller includes end-points as is shown below in the code
```ts
# app.controller.ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  @ApiBody({ type: RegisterTenantDto })
  registerTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const tenant: RegisterTenantDto = req.body;
      const response = this.appService.register(tenant);
      response.subscribe((result) => res.send(result));
    } catch (e) {
      return e;
    }
  }

  @Get('get-tenant-config/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  getTenantConfig(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantId: number = +req.params.id;

      const response = this.appService.getTenantConfig(tenantId);
      response.subscribe(async (result) => res.send(result));
    } catch (e) {
      return e;
    }
  }
  ...
}
``` 
These end point make calls to tenant microservice to communicate via TCP protocol as is shown below

```ts
# app.service.ts
export class AppService {
  constructor(
    @Inject('REGISTER_TENANT') private readonly client1: ClientProxy,
    @Inject('GET_TENANT_CONFIG') private readonly client2: ClientProxy,
  ) {}
  register(tenant: RegisterTenantDto) {
    return this.client1.send({ cmd: 'register-tenant' }, tenant);
  }
  getTenantConfig(id: number) {
    return this.client2.send({ cmd: 'get_config' }, id);
  }
  ...
}
```

### Start the server
```bash
$ npm run start
```
We can interact with the API through swagger by navigating to `http://localhost:5000/api/docs` while the application is running.

> The swagger screen is shown in the below image

![Swagger](https://user-images.githubusercontent.com/87708447/152340100-16ca5ab6-4e7a-48e2-9df7-dbfd32563926.png)

---
## Information Regarding the API

**1. Creating a Tenant**

API Endpoint:  `POST` `/api/tenants/`

**Input:** The input of the schema while creating a tenant is in the form of `JSON` format

```
{
  "tenantName": "String",
  "email": "String",
  "password": "String",
  "description": "String"
}
```
**Output:** The scehma of the output is also in the `JSON` format

```
{
   "Message": "Tenant Registered Successfully".
}
```
---
**2. Information Of Tenants**
API Endpoint: `GET` `/api/tenants`

**Input:** Since this is a `GET` request there are no input parameters.
**Output:** The schema of the output is in the form of lists which consists of `JSON` objects.
```
[
  {
    "id": 1,
    "tenantName": "Value",
    "email": "Value",
    "password": "Value",
    "description": "Value",
    "createdDateTime": "Value",
    "isDelete": "Value"
  },
  {},
  ...
]
```
---
**3. Updating the Tenant's Configuration**
API Endpoint: `PATCH` `/api/tenants`

**Input:** The schema of this input is in `NESTED JSON` format.
```
{
  "action": {
    "tenantName": "string",
    "description": "string"
  }
}
```
**Output** The schema of the output is also in `JSON` format
```
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
The `affected` key value 1 means the updation is successfull otherwise it is 0
```
---
**4. Deleting the Tenant's Configuration**
API Endpoint: `DELETE` `/api/tenants`

**Input:** The schema of this request is in the `JSON` format and `tenantName` is required.
```
{
  "tenantName":"st
}
```
**Output:** The schema of the output is again in `JSON` format which is as follows.
```
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```
>The operation that we are performing here is called as `VIRTUAL DELETE` which states that the entity is not hard deleted from the database which can be used later in order to retrieve from archive etc.
---
**5. Get Tenant's Configuration By Parameter**
API Endpoint: `GET` `/api/tenants/{id}`

**Input:** The input `id` is taken from the `request header` and the processed.

```
Request URL: `http://localhost:5000/api/tenants/1`
```
**Output:** The response of this request is presented in the `JSON` format.
```
{
  "id": Value,
  "tenantId": Value,
  "tenantName": "Value",
  "description": "Value",
  "createdDateTime": "Value",
  "tenantDbName": "Value",
  "host": "Value",
  "port": Value,
  "policy": "Value"
}
```
