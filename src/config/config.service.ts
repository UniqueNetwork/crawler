import { Injectable } from '@nestjs/common';
import {
  CrawlerApiServiceOptions,
  defaultCrawlerServiceOptions,
} from '../crawler-api/crawler-api-service-options';

@Injectable()
export class ConfigService {
  private options: CrawlerApiServiceOptions;

  constructor(options: Partial<CrawlerApiServiceOptions>) {
    this.options = { ...defaultCrawlerServiceOptions, ...options };
  }

  getOption(opt: string) {
    return this.options[opt] || null;
  }
}
