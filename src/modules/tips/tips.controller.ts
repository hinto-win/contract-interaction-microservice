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
import { PublishTipHeaders } from './tips.headers';

@ApiUseTags('tips')
@Controller('tips')
export class TipsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cryptographyService: CryptographyService,
    private readonly hintoContractService: HintoContractService,
  ) {
    const providerUrl =
      'https://' +
      configService.config.network +
      '.infura.io/v3/' +
      configService.config.infuraProjectID;
    hintoContractService.initialize(
      providerUrl,
      configService.config.contractAddress,
      configService.config.ethereumPrivateKey,
    );
  }

  @Post('publish')
  @ApiResponse({ status: 201, type: TipPublishedSuccessfullyDro })
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 400, type: AuthorizationError })
  async publishTip(
    @Headers() headers: PublishTipHeaders,
    @Body() publishTipDto: PublishTipDto,
  ) {
    if (this.configService.config.requireCryptographicAuthorization) {
      if (
        !lodash.includes(
          this.configService.config.allowedSecp256k1PublicKeysToCallAPI,
          headers.caller,
        )
      ) {
        return new AuthorizationError('Invalid caller');
      }
      const isSignatureValid = this.cryptographyService.isSignatureValid(
        headers.caller,
        publishTipDto.tipMetaHash,
        headers.signature,
      );

      if (!isSignatureValid) {
        return new AuthorizationError('Signature mismatch');
      }
    }

    if (publishTipDto.tipCode.length > 32) {
      return new PayloadError('Tip code to long');
    }

    let tipId;
    let txHash;

    try {
      const tip = await this.hintoContractService.publishTip(
        publishTipDto.tipCode,
        publishTipDto.tipMetaHash,
        publishTipDto.recipients,
      );
      tipId = tip.tipId;
      txHash = tip.txHash;
    } catch (err) {
      return new PayloadError(err.message);
    }

    return { error: false, tipId, txHash };
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
