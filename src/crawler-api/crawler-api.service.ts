import { Injectable, Logger } from '@nestjs/common';
import { interval, map, Observable, take } from 'rxjs';
import { RandomService } from '../random/random.service';
import {
  CrawlerApiServiceOptions,
  defaultCrawlerServiceOptions,
} from './crawler-api-service-options';

@Injectable()
export class CrawlerApiService {
  constructor(
    private readonly logger: Logger,
    private readonly randomService: RandomService,
  ) {}

  subscribeNewBlocks(): Observable<number> {
    this.logger.log('subscribeNewBlocks()');

    // todo: Create observable for blocks listening.
    return interval(1000).pipe(
      take(10),
      map(() => this.randomService.generate()),
    );
  }
}
