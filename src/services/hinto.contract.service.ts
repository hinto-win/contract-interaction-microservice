import { Contract, Wallet, utils, providers } from 'ethers';
import { Injectable } from '@nestjs/common';

import { readFileSync } from 'fs';

@Injectable()
export class HintoContractService {
  constructor() {
    this.abi = readFileSync('./utils/contract.abi.json', 'utf8');
  }

  private wallet: Wallet;
  private provider: providers.Provider;

  private contract: Contract;

  private abi: string;

  async initializeWallet(privateKey: string) {
    if (!utils.isHexString(privateKey)) {
      throw new Error('Invalid private key syntax');
    }

    if (!this.provider) {
      throw new Error('Please setup firstly the provider');
    }

    this.wallet = new Wallet(privateKey, this.provider);
  }
  async initializeProvider(
    network: 'mainnet' | 'rinkeby' | 'kovan',
    infuraProjectID: string,
  ) {
    this.provider = new providers.InfuraProvider(network, infuraProjectID);
  }

  async initializeContract(contractAddress: string) {
    this.contract = new Contract(contractAddress, this.abi, this.provider);
  }

  async publishTip(
    tipCode: string,
    tipMetaHash: string,
    restrictedToRecipients: Array<'Basic' | 'Premium' | 'VIP'>,
  ): Promise<string> {
    const contractWithSigner = this.contract.connect(this.wallet);

    const tx = await contractWithSigner.functions.publishTip(
      tipCode,
      tipMetaHash,
      restrictedToRecipients,
    );

    await tx.wait();

    const receipt = await this.provider.getTransactionReceipt(tx);
    console.log(receipt);

    return tx;
  }
}
