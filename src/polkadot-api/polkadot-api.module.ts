import { Logger, Module } from '@nestjs/common';
import { Utils } from '../utils';
import { PolkadotApiService } from './polkadot-api.service';
import { OpalApiProvider } from './providers/opal-api.provider';

@Module({
  providers: [Logger, OpalApiProvider, PolkadotApiService, Utils],
  exports: [PolkadotApiService],
})
export class PolkadotApiModule {}
