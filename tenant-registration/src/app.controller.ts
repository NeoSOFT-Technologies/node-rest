import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({cmd: 'hello-1' })
  // @EventPattern({cmd: 'hello-1' })
  getHello(message:string) {
    // return this.appService.getHello();
    console.log(this.appService.getHello(message));
    return message;
    
    
  }
}
