import {
  Body, Controller, Delete, Get, HttpException, HttpStatus,
  Patch, Post, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import { Roles } from './auth/roles.decorator';
import { Permission } from './auth/permission.decorator';
import { HttpErrorFilter } from './filter/http-exception.filter';
import {
  CredentialsDto, DbDetailsDto, LogoutDto, ProvisionTenantTableDto, RegisterTenantDto,
  TenantUserDto, UpdateTenantDto, UsersQueryDto, UpdateUserDto, RefreshAccessTokenDto,
  ClientDto, ResourceDto, PolicyDto, ScopeDto, PermissionDto, GetUsersInfoDto, CreateRoleDto,
  UpdateRoleDto, GetRoleInfoDto, GetPermissionsDto, UpdatePermissionDto
} from './dto';

@Controller('api')
@UseFilters(new HttpErrorFilter())
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
      const { tenantName, username } = body;
      let response: { clientId: string, clientSecret: string };

      if (tenantName && !username) {
        throw new HttpException('Please enter userName', HttpStatus.BAD_REQUEST);
      }
      else if (tenantName) {
        response = await this.appService.clientIdSecret(tenantName);
      }
      res.send((await this.authService.getAccessToken({ ...body, ...response })).data);
      // login successful
    } catch (e) {
      throw e;
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
      throw e;
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
      throw e;
    }
  }

  @Get('forgotPassword')
  @ApiTags('Authentication')
  @ApiQuery({ name: 'tenant', type: 'string', required: false })
  forgotPassword(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantName = req.query.tenant as string;
      const redirectUrl = this.appService.createRedirectUrl(tenantName);
      res.redirect(redirectUrl);
    } catch (e) {
      throw e;
    }
  }

  @Get('publicKey/:tenantName')
  @ApiTags('Authentication')
  @ApiParam({ name: 'tenantName', type: 'string', required: true })
  async publicKey(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantname: string = req.params.tenantName;
      const key = await this.authService.getpublicKey(tenantname);
      res.send(key);
    } catch (e) {
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }

  @Get('admin')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  // @Permission(['view'])
  async adminDetails(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      const userName = await this.authService.getUserName(token);

      const adminDetails = await this.appService.getAdminDetails(userName, token);
      res.send(adminDetails);
    } catch (e) {
      throw e;
    }
  }

  @Post('tenants')
  @ApiTags('Tenants')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: RegisterTenantDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  // @Permission(['create'])
  async registerTenant(@Body() body: RegisterTenantDto, @Req() req: Request, @Res() res: Response) {
    try {
      let { tenantName, email, password, clientDetails, databaseName } = body;
      const token = req.headers['authorization'];

      await this.appService.createRealm({ tenantName, email, password }, databaseName, token);
      const client = await this.appService.createClient({ tenantName, clientDetails }, token);

      const response = this.appService.register({ ...body, ...client });
      response.subscribe((result) => { res.send(result) });
    } catch (e) {
      throw e;
    }
  }

  @Get('tenant-info')
  @ApiTags('Tenants')
  @ApiQuery({ name: 'tenantName', type: 'string', required: false })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  // @Permission(['view'])
  async getTenantConfig(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      const tenantNameFromToken = await this.authService.getTenantName(token);
      let tenantName: string = req.query.tenantName as string;

      if (tenantNameFromToken === 'master' && !tenantName) {
        throw new HttpException('Please enter TenantName', HttpStatus.BAD_REQUEST);
      }
      else if (tenantNameFromToken !== 'master') {
        if (!tenantName) {
          tenantName = tenantNameFromToken;
        }
        else if (tenantName !== tenantNameFromToken) {
          throw new HttpException('Not Allowed', HttpStatus.FORBIDDEN);
        }
      }
      const response = this.appService.getTenantConfig(tenantName);
      const observer = {
        next: (result: any) => res.send(result),
        error: (error: any) => {
          res.status(error.status).send({
            statusCode: error.status,
            message: error.message
          })
        },
      }
      response.subscribe(observer);
    } catch (e) {
      throw e;
    }
  }

  @Get('tenants')
  @ApiTags('Tenants')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'isDeleted', type: 'boolean', required: false })
  @ApiQuery({ name: 'tenantName', type: 'string', required: false })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  // @Permission(['view'])
  listAllTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const { tenantName, isDeleted, page } = req.query as any;
      const response = this.appService.listAllTenant(tenantName, isDeleted, page);
      response.subscribe(async (result) => {
        const [data, count] = result;
        res.send({ data, count })
      });
    } catch (e) {
      throw e;
    }
  }

  @Patch('tenants')
  @ApiTags('Tenants')
  @ApiBody({ type: UpdateTenantDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  // @Permission(['edit'])
  async updateDescription(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      const tenantNameFromToken: string = await this.authService.getTenantName(token);
      let tenantName: string = req.body.action.tenantName;
      const newDescription: string = req.body.action.description;

      if (tenantNameFromToken === 'master' && !tenantName) {
        throw new HttpException('Please enter TenantName', HttpStatus.BAD_REQUEST);
      }
      else if (tenantNameFromToken !== 'master') {
        if (!tenantName) {
          tenantName = tenantNameFromToken;
        }
        else if (tenantName !== tenantNameFromToken) {
          throw new HttpException('Updation Not Allowed', HttpStatus.FORBIDDEN);
        }
      }
      const response = await this.appService.updateDescription(tenantName, newDescription);
      const observer = {
        next: async (result: any) => {
          res.send(result)
        },
        error: async (error: any) => {
          res.status(error.status).send({
            statusCode: error.status,
            message: error.message
          })
        },
      };
      response.subscribe(observer);
    } catch (e) {
      throw e;
    }
  }

  @Delete('tenants/:tenantName')
  @ApiTags('Tenants')
  @ApiParam({ name: 'tenantName', type: 'string', required: true })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  // @Permission(['delete'])
  async deleteTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const tenantname: string = req.params.tenantName;
      const token = req.headers['authorization'];
      const response = await this.appService.deleteTenant(tenantname, token);
      response.subscribe(async (result) => res.send(result));
    } catch (e) {
      throw e;
    }
  }

  @Post('user')
  @ApiTags('User')
  @ApiBody({ type: TenantUserDto })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin'])
  @Permission(['create'])
  async tenantUser(@Body() body: TenantUserDto, @Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.body.tenantName) {
        req.body.tenantName = await this.authService.getTenantName(token);
      }
      res.send(await this.appService.createUser(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Get('user')
  @ApiTags('User')
  @ApiQuery({ type: UsersQueryDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  @Permission(['view'])
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
      throw e;
    }
  }

  @Get('user-info')
  @ApiTags('User')
  @ApiQuery({ type: GetUsersInfoDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin', 'user'])
  @Permission(['view'])
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
      const userInfo = await this.appService.userInfo(req.query, token);
      const permissions = await this.authService.getPermissions(token);
      res.send({ ...userInfo, permissions });
    } catch (e) {
      throw e;
    }
  }

  @Patch('user')
  @ApiTags('User')
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin', 'user'])
  @Permission(['edit'])
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
      throw e;
    }
  }

  @Delete('user/:userName')
  @ApiTags('User')
  @ApiParam({ name: 'userName', type: 'string', required: true })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['tenantadmin'])
  @Permission(['delete'])
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      req.params.tenantName = await this.authService.getTenantName(token);
      const userName = await this.authService.getUserName(token);
      if (userName === req.params.userName) {
        throw new HttpException('Not Allowed', HttpStatus.FORBIDDEN);
      }
      res.send(await this.appService.deleteUser(req.params as any, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('roles')
  @ApiTags('Roles')
  @ApiBody({ type: CreateRoleDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async createRole(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.body.tenantName) {
        throw new HttpException('Please enter tenantName', HttpStatus.BAD_REQUEST);
      }
      const token = req.headers['authorization'];
      res.send(await this.appService.createRole(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Get('roles')
  @ApiTags('Roles')
  @ApiQuery({ name: 'tenantName', type: 'string', required: false })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  @Permission(['view'])
  async getAvailableRoles(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.query.tenantName) {
        req.query.tenantName = await this.authService.getTenantName(token);
      }
      const tenantName = req.query.tenantName as string;
      res.send(await this.appService.getRoles(tenantName, token));
    } catch (e) {
      throw e;
    }
  }

  @Get('role-info')
  @ApiTags('Roles')
  @ApiQuery({ type: GetRoleInfoDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['view'])
  async getRoleInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.query.tenantName) {
        throw new HttpException('Please enter tenantName', HttpStatus.BAD_REQUEST);
      }
      if (!req.query.roleName) {
        throw new HttpException('Please enter roleName', HttpStatus.BAD_REQUEST);
      }
      res.send(await this.appService.roleInfo(req.query as any, token));
    } catch (e) {
      throw e;
    }
  }

  @Patch('roles')
  @ApiTags('Roles')
  @ApiBody({ type: UpdateRoleDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['edit'])
  async updateRole(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.body.tenantName) {
        throw new HttpException('Please enter tenantName', HttpStatus.BAD_REQUEST);
      }
      if (!req.body.roleName) {
        throw new HttpException('Please enter roleName', HttpStatus.BAD_REQUEST);
      }
      const token = req.headers['authorization'];
      res.send(await this.appService.updateRole(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Delete('roles/:tenantName/:roleName')
  @ApiTags('Roles')
  @ApiParam({ name: 'roleName', type: 'string', required: true })
  @ApiParam({ name: 'tenantName', type: 'string', required: true })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['delete'])
  async deleteRole(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.deleteRole(req.params as any, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('permission')
  @ApiTags('Permission')
  @ApiBody({ type: PermissionDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async permission(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createPermission(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Get('permission')
  @ApiTags('Permission')
  @ApiQuery({ type: GetPermissionsDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin', 'tenantadmin'])
  @Permission(['read'])
  async listPermission(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      if (!req.query.tenantName) {
        req.query.tenantName = await this.authService.getTenantName(token);
      }
      res.send(await this.appService.getPermissions(req.query as any, token));
    } catch (e) {
      throw e;
    }
  }

  @Patch('permission')
  @ApiTags('Permission')
  @ApiBody({ type: UpdatePermissionDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['edit'])
  async updatePermission(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.updatePermission(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Delete('permission/:tenantName/:clientName/:permissionName-:permissionType')
  @ApiTags('Permission')
  @ApiParam({ name: 'permissionType', type: 'string', required: true })
  @ApiParam({ name: 'permissionName', type: 'string', required: true })
  @ApiParam({ name: 'clientName', type: 'string', required: true })
  @ApiParam({ name: 'tenantName', type: 'string', required: true })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['delete'])
  async deletePermission(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.deletePermission(req.params as any, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('client')
  @ApiTags('Keycloak')
  @ApiBody({ type: ClientDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async tenantClient(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createClient(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('resource')
  @ApiTags('Keycloak')
  @ApiBody({ type: ResourceDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async resource(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createResource(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('policy')
  @ApiTags('Keycloak')
  @ApiBody({ type: PolicyDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async policy(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createPolicy(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Post('scope')
  @ApiTags('Keycloak')
  @ApiBody({ type: ScopeDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  @Permission(['create'])
  async scope(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['authorization'];
      res.send(await this.appService.createScope(req.body, token));
    } catch (e) {
      throw e;
    }
  }

  @Get('connect-database')
  @ApiTags('Miscellaneous')
  @ApiQuery({ type: DbDetailsDto })
  @ApiBearerAuth()
  @UseGuards(KeycloakAuthGuard)
  async connectDatabase(@Req() req: Request, @Res() res: Response) {
    try {
      const dbDetails: DbDetailsDto = req.query as any;
      const token = req.headers['authorization'];
      const tenantNameFromToken: string = await this.authService.getTenantName(token);
      let tenantName: string = req.query.tenantName as string;

      if (tenantName !== tenantNameFromToken) {
          throw new HttpException('Wrong Tenant Name', HttpStatus.FORBIDDEN);
      }
      const response = await this.appService.connect(dbDetails);
      if (response) {
        res.send(response);
      }
    } catch (e) {
      throw e;
    }
  }

  @Post('create-table')
  @ApiTags('Miscellaneous')
  @ApiBody({ type: ProvisionTenantTableDto })
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  async createTable(@Req() req: Request, @Res() res: Response) {
    try {
      const tableDto: ProvisionTenantTableDto = req.body;
      const token = req.headers['authorization'];
      const response = this.appService.createTable(tableDto);
      
      response.subscribe((result) => res.send(result));
    } catch (e) {
      throw e;
    }
  }
}
