import { CrawlerApiServiceOptions } from '../crawler-api/crawler-api-service-options';
export declare class ConfigService {
    private options;
    constructor(options: CrawlerApiServiceOptions);
    getOption(opt: keyof CrawlerApiServiceOptions): string;
}
