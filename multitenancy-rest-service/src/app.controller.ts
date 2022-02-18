import {
  Body, Controller, Delete, Get, HttpStatus,
  Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { KeycloakAuthGuard } from './auth/guards/keycloak-auth.guard';
import { Roles } from './auth/roles.decorator';
import {
  CredentialsDto, DbDetailsDto, DeleteTenantDto, LogoutDto,
  ProvisionTenantTableDto, RegisterTenantDto, TenantUserDto, UpdateTenantDto
} from './dto';

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
  @UseGuards(KeycloakAuthGuard)
  @Roles(['admin'])
  listAllTenant(@Req() req: Request, @Res() res: Response) {
    try {
      const response = this.appService.listAllTenant();
      response.subscribe(async (result) => res.send(result));
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
