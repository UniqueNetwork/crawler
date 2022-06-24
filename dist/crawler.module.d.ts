import { DynamicModule } from '@nestjs/common';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
export declare class CrawlerModule {
    static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule;
}
