import { Injectable, Logger } from '@nestjs/common';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';

@Injectable()
export class BlockListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
  ) {}

  async startListening(): Promise<void> {
    // todo: Check api connection status
    await this.apiService.api.rpc.chain.subscribeNewHeads(async (header) => {
      const blockNumber = header.number.toNumber();

      this.logger.verbose(
        `Got new block ${blockNumber}`,
        'BlockListenerService',
      );
    });
  }
}
