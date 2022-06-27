import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BlockData } from '../types/block.types';
import { CollectionData } from '../types/collection.types';
import { BlockListenerService } from '../listeners/block-listener.service';
import { CollectionListenerService } from 'src/listeners/collection-listener.service';

@Injectable()
export class CrawlerApiService {
  constructor(
    private readonly blockListenerService: BlockListenerService,
    private readonly collectionListenerService: CollectionListenerService,
  ) {}

  subscribeNewBlocks(): Observable<BlockData> {
    return this.blockListenerService.startListening();
  }

  getBlockByNumber(blockNumber: number): Promise<BlockData> {
    return this.blockListenerService.getBlockByNumber(blockNumber);
  }

  getCollectionById(collectionId: number): Promise<CollectionData> {
    return this.collectionListenerService.getCollectionById(collectionId);
  }
}
