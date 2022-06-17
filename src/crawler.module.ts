import { DynamicModule, Logger, Module } from '@nestjs/common';
import { CrawlerApiService } from './crawler-api/crawler-api.service';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
import { RandomService } from './random/random.service';
import { ConfigService } from './config/config.service';
import { PolkadotApiService } from './polkadot-api/polkadot-api.service';
import { BlockListenerService } from './listeners/block-listener.service';
import { OpalApiProvider } from './polkadot-api/providers/opal-api.provider';

const configServiceFactory = (options: Partial<CrawlerApiServiceOptions>) => {
  return {
    provide: ConfigService,
    useFactory: () => {
      return new ConfigService(options);
    },
  };
};

/**
 * Module usage: https://github.com/chernetsky/crawler-usage
 */
@Module({
  providers: [
    Logger,
    RandomService,
    OpalApiProvider,
    PolkadotApiService,
    BlockListenerService,
    CrawlerApiService,
  ],
})
export class CrawlerModule {
  static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule {
    const providers = [configServiceFactory(options)];

    return {
      providers: providers,
      exports: [CrawlerApiService],
      module: CrawlerModule,
    };
  }
}
