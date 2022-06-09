import { DynamicModule, Logger, Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomServiceOptions } from './random-service-options';

const randomServiceFactory = (options: Partial<RandomServiceOptions>) => {
  return {
    provide: RandomService,
    useFactory: (logger: Logger) => {
      return new RandomService(options, logger);
    },
    inject: [Logger],
  };
};

@Module({})
export class CrawlerModule {
  static forRoot(options: Partial<RandomServiceOptions>): DynamicModule {
    const providers = [randomServiceFactory(options)];

    return {
      providers: providers,
      exports: providers,
      module: CrawlerModule,
    };
  }
}
