import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlockData } from '../types/block.types';
import { BlockListenerService } from '../listeners/block-listener.service';

@Injectable()
export class CrawlerApiService {
  constructor(private readonly blockListenerService: BlockListenerService) {}

  subscribeNewBlocks(): Promise<Observable<BlockData>> {
    return this.blockListenerService.startListening();
  }

  getBlockByNumber(blockNumber: number): Promise<BlockData> {
    return this.blockListenerService.getBlockByNumber(blockNumber);
  }
}
