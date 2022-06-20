import { Logger, Module } from '@nestjs/common';
import { PolkadotApiService } from './polkadot-api.service';
import { OpalApiProvider } from './providers/opal-api.provider';

@Module({
  providers: [Logger, OpalApiProvider, PolkadotApiService],
  exports: [PolkadotApiService],
})
export class PolkadotApiModule {}
