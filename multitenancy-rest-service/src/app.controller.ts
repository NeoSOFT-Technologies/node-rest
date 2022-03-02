import {
  Body, Controller, Delete, Get, HttpStatus,
  Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import { Roles } from './auth/roles.decorator';
import {
  ClientDto, CredentialsDto, DbDetailsDto, DeleteTenantDto, LogoutDto, PolicyDto,
  ProvisionTenantTableDto, RegisterTenantDto, ResourceDto, TenantUserDto, UpdateTenantDto,
  ScopeDto
} from './dto';

@ApiTags('API List')
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CredentialsDto })
  async login(@Body() body: CredentialsDto, @Res() res: Response) {
    try {
      res.send((await this.authService.getAccessToken(body)).data);
      // login successful
    } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send(e);
    }
  }

  @Post('logout')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: LogoutDto })
  async logout(@Body() body: LogoutDto, @Res() res: Response) {
    try {
      res.sendStatus(await this.authService.logout(body));
      // logout successful
    } catch (e) {
      return res.status(HttpStatus.UNAUTHORIZED).send(e);
    }
  }

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

  @Post('user')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: TenantUserDto })
  async tenantUser(@Body() body: TenantUserDto, @Res() res: Response) {
    try {
      const user: TenantUserDto = body;
      res.send(await this.appService.createUser(user));
    } catch (e) {
      return e;
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

  @Get('tenants')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  listAllTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const page: number = req.query.page as any || 1;
      const response = this.appService.listAllTenant(page);
      response.subscribe(async (result) => {
        const [data, count] = result;
        res.send({ data, count })
      });
    } catch (e) {
      return e;
    }
  }

  @Patch('tenants')
  @ApiBody({ type: UpdateTenantDto })
  updateDescription(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantname: string = req.body.action.tenantName;
      const newDescription: string = req.body.action.description;
      const response = this.appService.updateDescription(tenantname, newDescription);
      response.subscribe(async (result) => res.send(result));
    } catch (e) {
      return e;
    }
  }

  @Delete('tenants')
  @ApiBody({ type: DeleteTenantDto })
  deleteTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantname: string = req.body.tenantName;
      const response = this.appService.deleteTenant(tenantname);
      response.subscribe(async (result) => res.send(result));
    } catch (e) {
      return e;
    }
  }

  @Post('client')
  async tenantClient(@Body() body: ClientDto, @Res() res: Response) {
    try {
      res.send(await this.appService.createClient(body));
    } catch (e) {
      return res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('resource')
  async resource(@Body() body: ResourceDto, @Res() res: Response) {
    try {
      res.send(await this.appService.createResource(body));
    } catch (e) {
      return res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('policy')
  async policy(@Body() body: PolicyDto, @Res() res: Response) {
    try {
      res.send(await this.appService.createPolicy(body));
    } catch (e) {
      return res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('scope')
  async scope(@Body() body:ScopeDto, @Res() res: Response) {
    try{
      res.send(await this.appService.createScope(body));
    }catch(e){
      return res.status(e.response.status).send(e.response.data);
    }
  }

  @Get('connect-database')
  @ApiQuery({ type: DbDetailsDto })
  async connectDatabase(@Req() req: Request, @Res() res: Response) {
    try {
      const dbDetails: DbDetailsDto = req.query as any;
      const response = await this.appService.connect(dbDetails);

      if (response) {
        res.send(response);
      }
    } catch (e) {
      return e;
    }
  }

  @Post('create-table')
  @ApiBody({ type: ProvisionTenantTableDto })
  async createTable(@Req() req: Request, @Res() res: Response) {
    try {
      const tableDto: ProvisionTenantTableDto = req.body;
      const response = this.appService.createTable(tableDto);
      response.subscribe((result) => res.send(result));
    } catch (e) {
      return e;
    }
  }
}
