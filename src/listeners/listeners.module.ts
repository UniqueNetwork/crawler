import { Logger, Module } from '@nestjs/common';
import { Utils } from '../utils';
import { ConfigModule } from '../config/config.module';
import { PolkadotApiModule } from '../polkadot-api/polkadot-api.module';
import { BlockListenerService } from './block-listener.service';
import { CollectionListenerService } from './collection-listener.service';

@Module({
  imports: [ConfigModule, PolkadotApiModule],
  providers: [Logger, BlockListenerService, CollectionListenerService, Utils],
  exports: [BlockListenerService, CollectionListenerService],
})
export class ListenersModule {}
