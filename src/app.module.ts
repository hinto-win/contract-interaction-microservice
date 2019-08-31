import { Module } from '@nestjs/common';
import { ConfigModule } from './services/config.module';
import { HintoContractModule } from './services/hinto.contract.module';
import { TipsModule } from './modules/tips/tips.module';
import { CryptographyModule } from './services/cryptography.module';

@Module({
  imports: [ConfigModule, HintoContractModule, CryptographyModule, TipsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
