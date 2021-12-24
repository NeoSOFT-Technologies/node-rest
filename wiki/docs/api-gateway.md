# API-Gateway

This api-gateway has been included to interact with the tenant microservices. It has two endpoints namely `/register` and `get-tenant-config/:id`

### Installation
First run this command to install all dependency
```bash
$ npm install
```

### Controller
The controller include one HTTP POST end-point and one HTTP GET end-point as is shown below in the code
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
}
```

### Start the server
```bash
$ npm run start
```
We can interact with the API through swagger by navigating to `http://localhost:5000/api/docs` while the application is running

![swagger](https://user-images.githubusercontent.com/87794374/147329878-69b939c6-36d0-4cbc-a8de-73825aab51c2.PNG)
