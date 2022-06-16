import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { interval, map, Observable, take } from 'rxjs';
import { PolkadotApiService } from 'src/polkadot-api/polkadot-api.service';
import { RandomService } from '../random/random.service';
// import {
//   CrawlerApiServiceOptions,
//   defaultCrawlerServiceOptions,
// } from './crawler-api-service-options';

@Injectable()
export class CrawlerApiService {
  private api: ApiPromise;

  constructor(
    private readonly logger: Logger,
    private readonly randomService: RandomService,
    polkadotApiService: PolkadotApiService,
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
