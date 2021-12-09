import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';

@Injectable()
export class AppService {
  getHello(message: string): string {
    return message;
  }
}
