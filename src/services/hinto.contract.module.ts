import { Module } from '@nestjs/common';
import { HintoContractService } from './hinto.contract.service';

@Module({
  providers: [
    {
      provide: HintoContractService,
      useValue: new HintoContractService(),
    },
  ],
  exports: [HintoContractService],
})
export class HintoContractModule {}
