import { DynamicModule, Logger, Module } from '@nestjs/common';
import { CrawlerApiService } from './crawler-api/crawler-api.service';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
import { RandomService } from './random/random.service';

const crawlerApiServiceFactory = (
  options: Partial<CrawlerApiServiceOptions>,
) => {
  return {
    provide: CrawlerApiService,
    useFactory: (logger: Logger, randomService: RandomService) => {
      return new CrawlerApiService(options, logger, randomService);
    },
    inject: [Logger, RandomService],
  };
};

/**
 * Module usage: https://github.com/chernetsky/crawler-usage
 */
@Module({
  providers: [RandomService],
})
export class CrawlerModule {
  static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule {
    const providers = [crawlerApiServiceFactory(options)];

    return {
      providers: providers,
      exports: providers,
      module: CrawlerModule,
    };
  }
}
