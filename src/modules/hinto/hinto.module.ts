import { Module } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { HintoContractService } from 'src/services/hinto.contract.service';
import { HintoBlockchainController } from './hinto.controller';

@Module({
  imports: [],
  providers: [ConfigService, HintoContractService],
  controllers: [HintoBlockchainController],
})
export class HintoModule {}
