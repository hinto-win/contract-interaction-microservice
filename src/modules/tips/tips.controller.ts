import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { HintoContractService } from 'src/services/hinto.contract.service';
import { ApiUseTags, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PublishTipDto } from './tips.dtos';
import { CryptographyService } from 'src/services/cryptography.service';

import * as lodash from 'lodash';
import {
  TipPublishedSuccessfullyDro,
  AuthorizationError,
  PayloadError,
} from './tips.dros';

@ApiUseTags('tips')
@Controller('tips')
export class TipsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cryptographyService: CryptographyService,
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

  @Post('publish')
  @ApiResponse({ status: 201, type: TipPublishedSuccessfullyDro })
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 400, type: AuthorizationError })
  async publishTip(
    @Headers('caller') caller: string,
    @Headers('signature') signature: string,
    @Body() publishTipDto: PublishTipDto,
  ) {
    if (this.configService.config.requireCryptographicAuthorization) {
      if (
        !lodash.includes(
          this.configService.config.allowedSecp256k1PublicKeysToCallAPI,
          caller,
        )
      ) {
        return new AuthorizationError('Invalid caller');
      }
      const isSignatureValid = this.cryptographyService.isSignatureValid(
        caller,
        publishTipDto.tipMetaHash,
        signature,
      );

      if (!isSignatureValid) {
        return new AuthorizationError('Signature mismatch');
      }
    }

    if (publishTipDto.tipCode.length > 32) {
      return new PayloadError('Tip code to long');
    }

    if (publishTipDto.tipMetaHash.length != 64) {
      return new PayloadError('Invalid SHA256 hash');
    }

    const tipId = await this.hintoContractService.publishTip(
      publishTipDto.tipCode,
      publishTipDto.tipMetaHash,
      publishTipDto.recipients,
    );

    return { error: false, tipId };
  }

  @ApiExcludeEndpoint()
  @Post('invalidate')
  async invalidTip() {}

  @ApiExcludeEndpoint()
  @Get('all')
  async getAllTips() {}

  @ApiExcludeEndpoint()
  @Get('last-id')
  async getLastTipID() {}

  @ApiExcludeEndpoint()
  @Get('by-id')
  async getTipByID() {}
}
