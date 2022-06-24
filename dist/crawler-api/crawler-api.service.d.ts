import { Observable } from 'rxjs';
import { BlockData } from '../types/block.types';
import { BlockListenerService } from '../listeners/block-listener.service';
export declare class CrawlerApiService {
    private readonly blockListenerService;
    constructor(blockListenerService: BlockListenerService);
    subscribeNewBlocks(): Observable<BlockData>;
    getBlockByNumber(blockNumber: number): Promise<BlockData>;
}
