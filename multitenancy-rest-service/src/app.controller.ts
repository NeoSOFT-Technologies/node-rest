import {
  Body, Controller, Delete, Get, HttpException, HttpStatus,
  Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import { Roles } from './auth/roles.decorator';
import {
  CredentialsDto, DbDetailsDto, DeleteTenantDto, LogoutDto, ProvisionTenantTableDto, RegisterTenantDto,
  TenantUserDto, UpdateTenantDto, UsersQueryDto, UpdateUserDto, DeleteUserDto, RefreshAccessTokenDto,
  ClientDto, ResourceDto, PolicyDto, ScopeDto, PermissionDto, GetUsersInfoDto
} from './dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Post('login')
  @ApiTags('Authentication')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CredentialsDto })
  async login(@Body() body: CredentialsDto, @Res() res: Response) {
    try {
      const { tenantName } = body;
      let response: { clientId: string, clientSecret: string };

      if (tenantName) {
        response = await this.appService.clientIdSecret(tenantName);
      }
      res.send((await this.authService.getAccessToken({ ...body, ...response })).data);
      // login successful
    } catch (e) {
      if (e.status) {
        res.status(e.status).send(e.message);
      }
      else if (e.response && e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    }
  }

  @Post('logout')
  @ApiTags('Authentication')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: LogoutDto })
  async logout(@Body() body: LogoutDto, @Res() res: Response) {
    try {
      const { refreshToken } = body;
      let response: { clientId: string, clientSecret: string };

      if (!body.tenantName) {
        body.tenantName = await this.authService.getTenantName(refreshToken)
      }

      if (body.tenantName !== 'master') {
        response = await this.appService.clientIdSecret(body.tenantName);
      }
      res.sendStatus(await this.authService.logout({ ...body, ...response }));
      // logout successful
    } catch (e) {
      if (e.status) {
        res.status(e.status).send(e.message);
      }
      else if (e.response && e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    }
  }

  @Post('refresh-access-token')
  @ApiTags('Authentication')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RefreshAccessTokenDto })
  async refreshAccessToken(@Body() body: RefreshAccessTokenDto, @Res() res: Response) {
    try {
      const { refreshToken } = body;
      let response: { clientId: string, clientSecret: string };

      if (!body.tenantName) {
        body.tenantName = await this.authService.getTenantName(refreshToken)
      }

      if (body.tenantName !== 'master') {
        response = await this.appService.clientIdSecret(body.tenantName);
      }
      res.send((await this.authService.refreshAccessToken({ ...body, ...response })).data);
    } catch (e) {
      if (e.status) {
        res.status(e.status).send(e.message);
      }
      else if (e.response && e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    }
  }

  @Post('tenants')
  @ApiTags('Tenants')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RegisterTenantDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async registerTenant(@Body() body: RegisterTenantDto, @Req() req: Request, @Res() res: Response) {
    try {
      let { tenantName, email, password } = body;
      const token = req.headers['authorization'];

      await this.appService.createRealm({ tenantName, email, password }, token);
      const client = await this.appService.createClient({ tenantName }, token);

      const response = this.appService.register({ ...body, ...client });
      response.subscribe((result) => { res.send(result) });
    } catch (e) {
      if (e.response && e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
      }
    }
  }

  @Get('tenants/:id')
  @ApiTags('Tenants')
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  getTenantConfig(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantId: number = +req.params.id;

      const response = this.appService.getTenantConfig(tenantId);
      const observer = {
        next: async (result: any) => res.send(result),
        error: async (error: any) => {
          res.status(error.status).send(error.message)
        },
      }
      response.subscribe(observer);
    } catch (e) {
      return e;
    }
  }

  @Get('tenants')
  @ApiTags('Tenants')
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
  @ApiTags('Tenants')
  @ApiBody({ type: UpdateTenantDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
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
  @ApiTags('Tenants')
  @ApiBody({ type: DeleteTenantDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  deleteTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantname: string = req.body.tenantName;
      const response = this.appService.deleteTenant(tenantname);
      response.subscribe(async (result) => res.send(result));
    } catch (e) {
      return e;
    }
  }

  @Post('user')
  @ApiTags('User')
  @ApiBody({ type: TenantUserDto })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin'])
  async tenantUser(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.body.tenantName) {
        req.body.tenantName = await this.authService.getTenantName(token);
      }
      res.send(await this.appService.createUser(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Get('user')
  @ApiTags('User')
  @ApiQuery({ type: UsersQueryDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  async listAllUser(@Req() req: Request, @Res() res: Response) {
    try {
      const data = {
        query: req.query as any,
        token: req.headers['authorization']
      }
      if (!data.query.tenantName) {
        data.query.tenantName = await this.authService.getTenantName(data.token);
      }
      res.send(await this.appService.listAllUser(data));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Get('user-info')
  @ApiTags('User')
  @ApiQuery({ type: GetUsersInfoDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin', 'user'])
  async getUserInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];

      if (!req.query.tenantName) {
        req.query.tenantName = await this.authService.getTenantName(token);
      }
      const userName = await this.authService.getUserName(token);
      const isUser = await this.authService.checkUserRole(token);
      if (!req.query.userName) {
        req.query.userName = userName;
      }
      else if (isUser && req.query.userName !== userName) {
        throw new HttpException(
          'Not Allowed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }
      res.send(await this.appService.userInfo(req.query, token));
    } catch (e) {
      if (e.response.statusCode) {
        res.status(e.response.statusCode).send(e.response.message);
      }
      else if (e.status) {
        res.status(e.status).send(e.response);
      }
    }
  }

  @Patch('user')
  @ApiTags('User')
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin', 'user'])
  async updateUser(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.body.tenantName) {
        req.body.tenantName = await this.authService.getTenantName(token);
      }
      const userName = await this.authService.getUserName(token);
      const isUser = await this.authService.checkUserRole(token);
      if (!isUser && !req.body.userName) {
        throw new HttpException('Please enter userName', HttpStatus.BAD_REQUEST);
      }
      if (isUser && !req.body.userName) {
        req.body.userName = userName;
      }
      else if (isUser && req.body.userName !== userName) {
        throw new HttpException('Not Allowed', HttpStatus.FORBIDDEN);
      }
      if (isUser && req.body.action.realmRoles) {
        throw new HttpException('Roles Updation not allowed', HttpStatus.FORBIDDEN)
      };
      res.send(await this.appService.updateUser(req.body, token));
    } catch (e) {
      if (e.response.statusCode) {
        res.status(e.response.statusCode).send(e.response.message);
      }
      else if (e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else if (e.status) {
        res.status(e.status).send(e.response);
      }
    }
  }

  @Delete('user')
  @ApiTags('User')
  @ApiBody({ type: DeleteUserDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin'])
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.body.tenantName) {
        req.body.tenantName = await this.authService.getTenantName(token);
      }
      if (!req.body.userName) {
        throw new HttpException('Please enter userName', HttpStatus.BAD_REQUEST);
      }
      res.send(await this.appService.deleteUser(req.body, token));
    } catch (e) {
      if (e.response.statusCode) {
        res.status(e.response.statusCode).send(e.response.message);
      }
      else if (e.response.status) {
        res.status(e.response.status).send(e.response.data);
      }
      else if (e.status) {
        res.status(e.status).send(e.response);
      }
    }
  }

  @Post('client')
  @ApiTags('Keycloak')
  @ApiBody({ type: ClientDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async tenantClient(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createClient(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Get('roles')
  @ApiTags('Keycloak')
  @ApiQuery({ name: 'tenantName', type: 'string', required: false })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  async getAvailableRoles(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.query.tenantName) {
        req.query.tenantName = await this.authService.getTenantName(token);
      }
      const tenantName = req.query.tenantName as string;
      res.send(await this.appService.getRoles(tenantName, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('resource')
  @ApiTags('Keycloak')
  @ApiBody({ type: ResourceDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async resource(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createResource(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('policy')
  @ApiTags('Keycloak')
  @ApiBody({ type: PolicyDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async policy(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createPolicy(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('scope')
  @ApiTags('Keycloak')
  @ApiBody({ type: ScopeDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async scope(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createScope(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Post('permission')
  @ApiTags('Keycloak')
  @ApiBody({ type: PermissionDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  async permission(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createPermission(req.body, token));
    } catch (e) {
      res.status(e.response.status).send(e.response.data);
    }
  }

  @Get('connect-database')
  @ApiTags('Miscellaneous')
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
  @ApiTags('Miscellaneous')
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
