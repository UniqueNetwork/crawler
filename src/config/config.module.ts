import { DynamicModule, Module } from '@nestjs/common';
import { CrawlerApiServiceOptions } from '../crawler-api/crawler-api-service-options';
import { ConfigService } from './config.service';

const configServiceFactory = (options: Partial<CrawlerApiServiceOptions>) => {
  return {
    provide: ConfigService,
    useFactory: () => {
      return new ConfigService(options);
    },
  };
};

@Module({})
export class ConfigModule {
  static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule {
    const providers = [configServiceFactory(options)];

    return {
      providers: providers,
      exports: providers,
      global: true,
      module: ConfigModule,
    };
  }
}
