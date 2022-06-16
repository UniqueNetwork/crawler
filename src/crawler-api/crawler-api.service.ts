import { Injectable, Logger } from '@nestjs/common';
import { interval, map, Observable, take } from 'rxjs';
import { BlockListenerService } from '../listeners/block-listener.service';
import { RandomService } from '../random/random.service';

@Injectable()
export class CrawlerApiService {
  constructor(
    private readonly logger: Logger,

    private readonly blockListenerService: BlockListenerService,

    private readonly randomService: RandomService,
  ) {}

  subscribeNewBlocks(): Observable<number> {
    this.logger.verbose('subscribeNewBlocks()', 'CrawlerApiService');

    // todo: Create Observable
    this.blockListenerService.startListening();

    // todo: Create observable for blocks listening.
    return interval(1000).pipe(
      take(2),
      map(() => this.randomService.generate()),
    );
  }
}
