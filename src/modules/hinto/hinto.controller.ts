import { Controller } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { HintoContractService } from 'src/services/hinto.contract.service';

@Controller('hinto')
export class HintoBlockchainController {
  constructor(
    private readonly configService: ConfigService,
    private readonly hintoContractService: HintoContractService,
  ) {
    hintoContractService.initializeProvider(
      configService.config.network,
      configService.config.infuraProjectID,
    );
    hintoContractService.initializeWallet(
      configService.config.ethereumPrivateKey,
    );

    hintoContractService.initializeContract(
      configService.config.contractAddress,
    );
  }
}
