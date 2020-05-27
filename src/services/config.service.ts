import { readFileSync } from 'fs';

export class ConfigService {
  public config: {
    ethereumPrivateKey: string;
    requireCryptographicAuthorization: boolean;
    allowedSecp256k1PublicKeysToCallAPI: string[];
    contractAddress: string;
    ethereumProviderUrl: string;
  };
  constructor() {
    this.config = JSON.parse(
      readFileSync(process.env.CONFIG_FILE_PATH, {
        encoding: 'utf8',
      }).toString(),
    );
  }
}
