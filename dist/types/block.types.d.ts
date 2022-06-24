import { EventData } from './event.types';
import { ExtrinsicData } from './extrinsic.types';
export declare type BlockData = {
    blockNumber: number;
    timestamp: number;
    blockHash: string;
    parentHash: string;
    stateRoot: string;
    extrinsicsRoot: string;
    totalIssuance: string;
    specName: string;
    specVersion: number;
    events: EventData;
    extrinsics: ExtrinsicData;
};
