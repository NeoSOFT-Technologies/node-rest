# Multitenancy Rest Service

This multitenancy-rest-service has been included to interact with the tenant microservices and test its working. It has the following endpoints namely
- `Login` `/api/login/` - HTTP POST: It provides the access token after authenticating the user.
- `Logout` `/api/logout/` - HTTP POST: It revokes the provided access token.
- `Refresh Access Token` `/api/refresh-access-token/` - HTTP POST: It generates new access token using refresh token.
- `Register tenant` `/api/tenants/` - HTTP POST: It registers a new tenant by consuming tenant-registration microservice.
- `Get All Tenant` `api/tenants/`- HTTP GET: It retreives all the registered tenant information from database.The output has been paginated to reduce load time
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

  @Post('tenants')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RegisterTenantDto })
  async registerTenant(@Body() body: RegisterTenantDto, @Res() res: Response) {
    try {
      const tenant: RegisterTenantDto = body;
      const response = this.appService.register(tenant);
      await this.appService.createRealm(tenant);
      response.subscribe((result) => res.send(result));
    } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send(e);
    }
  }

  @Get('tenants/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  getTenantConfig(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantId: number = +req.params.id;

      const response = this.appService.getTenantConfig(tenantId);
      const observer = {
        next: async (result: any) => res.send(result),
        error: async (error: any) => res.send(error),
      }
      response.subscribe(observer);
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

**1. Log in**

API Endpoint:  `POST` `/api/login/`

**Input:** The input of the schema while logging in the form of `JSON` format

```
{
  "username": "String",
  "password": "String",
  "tenantName": "String",
}
```
**Output:** The scehma of the output is also in the `JSON` format

```
{
    "access_token": "ACCESS TOKEN",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "REFRESH TOKEN",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "",
    "scope": ""
}
```
---
**2. Log Out**

API Endpoint:  `POST` `/api/logout/`

**Input:** The input of the schema logging out is in the form of `JSON` format

```
{
  "refreshToken": "String",
}
```
**Output:** The output has no content with status code `204`

---
**3. Refresh Access Token**

API Endpoint:  `POST` `/api/refresh-access-token/`

**Input:** The input schema is shown below

```
{
  "refreshToken": "String",
}
```
**Output:** The scehma of the output is also in the `JSON` format

```
{
    "access_token": "ACCESS TOKEN",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "REFRESH TOKEN",
    "token_type": "Bearer",
    "not-before-policy": 0,
    "session_state": "",
    "scope": ""
}
```
---
**4. Creating a Tenant**

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
**5. Information Of Tenants**
API Endpoint: `GET` `/api/tenants`

**Input:** Query parameter page number

**Output:** The schema of the output is in the form of `JSON`
```json
{
  "data": [
  {
    "id": 1,
    "tenantName": "Value",
    "email": "Value",
    "password": "Value",
    "description": "Value",
    "createdDateTime": "Value",
    "isDelete": "Value"
  },
  {
    ...
  },
  ...
 ],
  "count": 12
}
```
The `"data"` key contains the tenants array limited to 5 tenants and `"count"` contains the total tenants available

---
**6. Updating the Tenant's Configuration**
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
**7. Deleting the Tenant's Configuration**
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
**8. Get Tenant's Configuration By Parameter**
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
---
**9. Connect Database**
API Endpoint: `GET` `/api/connect-database`
**Input:** The input for this endpoint is in the form of `request query` which is of the following format.
```
The parameters are of the following format.
host: String
port: Number
tenantName: String
password: String
dbName: String
```
> Since our application is dockerised so in `host` we have to add `database` and if it was not dockerised we have to write `host: 127.0.0.1`

**Output:** The output when the credentials are verified is in the `JSON` format.
```
{
  "Message": "Database connected successfuly"
}
```
---

**10. API Ceate Table**
API Endpoint: `POST` `/api/create-table`

**Input:** The input for this endpoint is in the `JSON` format which consists the following parameters.
```
{
  "dbName": "string",
  "tableName": "string",
  "columns": [
    "string"
  ]
}
```
**Output:** The output here is a message which is again present in the `JSON` format.
```
{
    "Message": "Table Created Successfully"
}
```
---
**11. Creating a user under a particular Tenant**
API Endpoint: `POST` `/api/create-user`
**Input:** The input for this request is in `JSON` format with the following parameters.

```
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "tenantName": "string"
}
```
> Note: `password` is the password of the tenant under which the user is being created.


**Output:** The response of this request is present in the `JSON` format
```
{
   "Message": "User created Successfully."
}
```
