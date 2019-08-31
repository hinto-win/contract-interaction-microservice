import { Module } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { HintoContractService } from 'src/services/hinto.contract.service';
import { TipsController } from './tips.controller';
import { CryptographyService } from 'src/services/cryptography.service';

@Module({
  imports: [],
  providers: [ConfigService, CryptographyService, HintoContractService],
  controllers: [TipsController],
})
export class TipsModule {}
