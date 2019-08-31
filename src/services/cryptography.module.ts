import { Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';

@Module({
  providers: [
    {
      provide: CryptographyService,
      useValue: new CryptographyService(),
    },
  ],
  exports: [CryptographyService],
})
export class CryptographyModule {}
