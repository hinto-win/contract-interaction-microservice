import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from './services/config.module';
import { HintoContractModule } from './services/hinto.contract.module';
import { HintoModule } from './modules/hinto/hinto.module';

@Module({
  imports: [ConfigModule, HintoContractModule, HintoModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
