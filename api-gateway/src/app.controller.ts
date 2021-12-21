import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterTenantDto } from './dto/register.tenant.dto';
import { AppService } from './app.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

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
