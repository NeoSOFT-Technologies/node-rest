import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistertenantModule } from './tenant-reg/registertenant.module';

@Module({
  imports: [RegistertenantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
