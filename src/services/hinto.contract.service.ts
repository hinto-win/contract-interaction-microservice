import { Injectable } from '@nestjs/common';

import { HintoSdk } from 'hinto-contracts-sdk/dist';

@Injectable()
export class HintoContractService {
  constructor() {}

  private hintoSdk: HintoSdk;

  async initialize(
    providerUrl: string,
    contractAddress: string,
    privateKey: string,
  ) {
    this.hintoSdk = new HintoSdk(providerUrl, contractAddress, privateKey);
  }

  async publishTip(
    tipCode: string,
    tipMetaHash: string,
    restrictedToRecipients: Array<'Basic' | 'Premium' | 'VIP'>,
  ): Promise<number> {
    try {
      const tipId = await this.hintoSdk.publishTip(
        tipCode,
        tipMetaHash,
        restrictedToRecipients,
      );
      return tipId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async approvePublisher(publisher: string) {
    try {
      await this.hintoSdk.approvePublisher(publisher);
    } catch (err) {
      throw err;
    }
  }
}
