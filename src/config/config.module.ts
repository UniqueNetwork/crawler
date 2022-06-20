import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../constants';
import {
  CrawlerApiServiceOptions,
  defaultCrawlerServiceOptions,
} from '../crawler-api/crawler-api-service-options';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule {
    return {
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: { ...defaultCrawlerServiceOptions, ...options },
        },
        ConfigService,
      ],
      exports: [ConfigService],
      global: true,
      module: ConfigModule,
    };
  }
}
