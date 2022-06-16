import { DynamicModule, Logger, Module } from '@nestjs/common';
import { CrawlerApiService } from './crawler-api/crawler-api.service';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
import { RandomService } from './random/random.service';
import { ConfigService } from './config/config.service';

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
  providers: [CrawlerApiService, RandomService, Logger],
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
