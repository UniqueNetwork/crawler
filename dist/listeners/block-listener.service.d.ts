import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { Utils } from '../utils';
import { BlockData } from '../types/block.types';
export declare class BlockListenerService {
    private readonly logger;
    private apiService;
    private utils;
    constructor(logger: Logger, apiService: PolkadotApiService, utils: Utils);
    get api(): import("@polkadot/api").ApiPromise;
    private getTimestampFromExtrinsics;
    private parseEventAmount;
    private parseEventRecord;
    private parseExtrinsicRecord;
    private getBlockDataByNumber;
    private getBlockDataByHash;
    startListening(): Observable<BlockData>;
    getBlockByNumber(blockNumber: number): Promise<BlockData>;
}
