import { Injectable } from '@nestjs/common';

import { ec } from 'elliptic';

@Injectable()
export class CryptographyService {
  constructor() {}
  private elliptic = new ec('secp256k1');

  async isSignatureValid(
    signer: string,
    payload: string,
    signature: string,
  ): Promise<boolean> {
    const pubKey = this.elliptic.keyFromPublic(signer, 'hex');

    try {
      const isValid = pubKey.verify(payload, signature);
      return isValid;
    } catch (err) {
      return false;
    }
  }

  async signMessage(msg: string, privateKey: string) {
    let keyPair: ec.KeyPair;
    try {
      keyPair = this.elliptic.keyFromPrivate(privateKey);
    } catch (err) {
      throw new Error('Invalid private key');
    }
    const signature = keyPair.sign(msg);
    return signature.toDER('hex');
  }
}
