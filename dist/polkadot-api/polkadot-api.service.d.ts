import { Logger } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { ConfigService } from '../config/config.service';
import { OpalApiProvider } from './providers/opal-api.provider';
export declare class PolkadotApiService {
    private readonly configService;
    private readonly logger;
    private readonly apiProvider;
    private _api;
    isReady: Promise<boolean>;
    constructor(configService: ConfigService, logger: Logger, apiProvider: OpalApiProvider);
    get api(): ApiPromise;
    private getPolkadotAPI;
}
