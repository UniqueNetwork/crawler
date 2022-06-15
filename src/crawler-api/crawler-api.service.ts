import { Injectable, Logger } from '@nestjs/common';
import { interval, map, Observable, take } from 'rxjs';
import { RandomService } from '../random/random.service';
import {
  CrawlerApiServiceOptions,
  defaultCrawlerServiceOptions,
} from './crawler-api-service-options';

@Injectable()
export class CrawlerApiService {
  private options: CrawlerApiServiceOptions;

  constructor(
    options: Partial<CrawlerApiServiceOptions>,
    private readonly logger: Logger,
    private readonly randomService: RandomService,
  ) {
    this.options = { ...defaultCrawlerServiceOptions, ...options };

    // todo: Init chain connection
    // todo: and pass this.api object into dependencies?
    // todo: I don't like this kind of initialiszation.
    this.randomService.init(options, logger);
  }

  subscribeNewBlocks(): Observable<number> {
    this.logger.log('subscribeNewBlocks()');

    // todo: Create observable for blocks listening.
    return interval(1000).pipe(
      take(10),
      map(() => this.randomService.generate()),
    );
  }
}
