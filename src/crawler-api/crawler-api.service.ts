import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlockListenerService } from '../listeners/block-listener.service';

@Injectable()
export class CrawlerApiService {
  constructor(private readonly blockListenerService: BlockListenerService) {}

  subscribeNewBlocks(): Promise<Observable<unknown>> {
    return this.blockListenerService.startListening();
  }

  getBlockByNumber(blockNumber: number): Promise<Observable<unknown>> {
    return this.blockListenerService.getBlockByNumber(blockNumber);
  }
}
