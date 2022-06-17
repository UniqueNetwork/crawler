import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlockListenerService } from '../listeners/block-listener.service';

@Injectable()
export class CrawlerApiService {
  constructor(
    private readonly logger: Logger,
    private readonly blockListenerService: BlockListenerService,
  ) {}

  subscribeNewBlocks(): Observable<unknown> {
    this.logger.verbose('subscribeNewBlocks()', 'CrawlerApiService');

    return this.blockListenerService.startListening();
  }
}
