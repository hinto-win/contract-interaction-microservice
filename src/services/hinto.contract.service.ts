import * as ethers from 'ethers';
import { Injectable } from '@nestjs/common';

import { readFileSync } from 'fs';

import Web3 = require('web3');
import Contract from 'web3/eth/contract';
import { Account } from 'web3/eth/accounts';
import { Provider } from 'web3/providers';
import { TransactionReceipt } from 'web3/types';

@Injectable()
export class HintoContractService {
  constructor() {
    this.abi = readFileSync('src/utils/contract.abi.json', 'utf8');
  }

  private wallet: Account;
  private web3: Web3;

  private contract: Contract;

  private abi: string;

  private provider: Provider;

  async initializeWallet(privateKey: string) {
    if (!this.web3.utils.isHex(privateKey)) {
      throw new Error('Invalid private key syntax');
    }

    if (!this.web3) {
      throw new Error('Please setup firstly the provider');
    }

    this.wallet = this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }
  async initializeProvider(
    network: 'mainnet' | 'rinkeby' | 'kovan' | 'goerli',
    infuraProjectID: string,
  ) {
    const provider = new Web3.providers.HttpProvider(
      'https://' + network + '.infura.io/v3/' + infuraProjectID,
    );
    this.provider = provider;
    this.web3 = new Web3(provider);
  }

  async initializeContract(contractAddress: string) {
    this.contract = new this.web3.eth.Contract(
      JSON.parse(this.abi),
      contractAddress,
    );
    this.contract.setProvider(this.provider);
  }

  async publishTip(
    tipCode: string,
    tipMetaHash: string,
    restrictedToRecipients: Array<'Basic' | 'Premium' | 'VIP'>,
  ): Promise<string> {
    const methodCall = this.contract.methods.publishTip(
      Web3.utils.hexToBytes(Web3.utils.fromAscii(tipCode)),
      Web3.utils.hexToBytes('0x' + tipMetaHash),
      restrictedToRecipients.map(recipient => {
        return Web3.utils.hexToBytes(Web3.utils.fromAscii(recipient));
      }),
    );

    const encodedABI = methodCall.encodeABI();
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await methodCall.estimateGas({
      from: this.wallet.address,
      to: this.contract.options.address,
    });

    const tx = {
      data: encodedABI,
      from: this.wallet.address,
      to: this.contract.options.address,
      gasPrice: gasPrice,
      gasLimit: gasEstimate,
    };

    const signedTx = await this.wallet.signTransaction(tx);

    let txReceipt: TransactionReceipt;

    try {
      txReceipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );
    } catch (err) {
      throw new Error(err.message);
    }

    const eventValues = await this.processEvents(txReceipt, 'TipPublished');

    return eventValues.tipId;
  }

  async approvePublisher(publisher: string) {
    const isAddressValid = Web3.utils.isAddress(publisher);

    if (!isAddressValid) {
      throw new Error('Invalid ethereum address has been given');
    }

    const methodCall = this.contract.methods.approvePublisher(publisher);

    const encodedABI = methodCall.encodeABI();

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await methodCall.estimateGas({
      from: this.wallet.address,
      to: this.contract.options.address,
    });

    const tx = {
      data: encodedABI,
      from: this.wallet.address,
      to: this.contract.options.address,
      gasPrice: gasPrice,
      gasLimit: gasEstimate,
    };

    const signedTx = await this.wallet.signTransaction(tx);

    let txReceipt: TransactionReceipt;

    try {
      txReceipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );
    } catch (err) {
      throw new Error(err.message);
    }

    // const eventValues = await this.processEvents(txReceipt, 'ApprovePublisher');
  }

  private async processEvents(
    txReceipt: TransactionReceipt,
    eventName: string,
  ): Promise<any> {
    const events = await this.contract.getPastEvents(eventName, {
      fromBlock: txReceipt.blockNumber,
    });

    let _eventId: number;

    for (let i = 0; i < events.length; i++) {
      if (events[i].transactionHash === txReceipt.transactionHash) {
        _eventId = i;
      }
    }

    return events[_eventId].returnValues;
  }
}
