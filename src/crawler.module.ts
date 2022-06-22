import { DynamicModule, Logger, Module } from '@nestjs/common';
import { CrawlerApiService } from './crawler-api/crawler-api.service';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
import { ConfigModule } from './config/config.module';
import { ListenersModule } from './listeners/listeners.module';
import { Utils } from './utils';

/**
 * Module usage: https://github.com/chernetsky/crawler-usage
 */
@Module({
  imports: [ListenersModule],
  providers: [Logger, CrawlerApiService, Utils],
  exports: [CrawlerApiService],
})
export class CrawlerModule {
  static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule {
    return {
      imports: [ConfigModule.forRoot(options)],
      module: CrawlerModule,
    };
  }
}
