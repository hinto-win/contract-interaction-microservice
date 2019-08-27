import { readFileSync } from 'fs';

export class ConfigService {
  public config: {
    infuraProjectID: string;
    ethereumPrivateKey: string;
    requireCryptographicAuthorization: boolean;
    allowedSecp256k1PublicKeysToCallAPI: string[];
    network: 'mainnet' | 'rinkeby' | 'kovan';
    contractAddress: string;
  };
  constructor() {
    this.config = JSON.parse(
      readFileSync(process.env.CONFIG_FILE_PATH, {
        encoding: 'utf8',
      }).toString(),
    );
  }
}
