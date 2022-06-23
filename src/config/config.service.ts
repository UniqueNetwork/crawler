import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../constants';
import { CrawlerApiServiceOptions } from '../crawler-api/crawler-api-service-options';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIG_OPTIONS) private options: CrawlerApiServiceOptions,
  ) {}

  getOption(opt: keyof CrawlerApiServiceOptions) {
    return this.options[opt] || null;
  }
}
