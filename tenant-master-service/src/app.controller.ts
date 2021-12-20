import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
  MessagePattern,
  EventPattern,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern({ cmd: 'hello-message' })
  getConfigTenantService(message: string) {
    return this.appService.getHello(message);
  }
}
