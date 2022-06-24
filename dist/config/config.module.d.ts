import { DynamicModule } from '@nestjs/common';
import { CrawlerApiServiceOptions } from '../crawler-api/crawler-api-service-options';
export declare class ConfigModule {
    static forRoot(options: Partial<CrawlerApiServiceOptions>): DynamicModule;
}
