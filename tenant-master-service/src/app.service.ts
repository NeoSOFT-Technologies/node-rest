import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TenantDetailsDto } from './dto/tenant.details.dto';

@Injectable()
export class AppService {
  getHello(message: string): string{
    return message;
  }
}
