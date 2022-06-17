import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';

@Injectable()
export class BlockListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
  ) {}

  startListening(): Observable<unknown> {
    // todo: Check api connection status first

    return new Observable((subscriber) => {
      this.apiService.api.rpc.chain.subscribeNewHeads(async (header) => {
        // console.log(header);
        const blockNumber = header.number.toNumber();

        this.logger.verbose(
          `Got new block ${blockNumber}`,
          'BlockListenerService',
        );

        subscriber.next(blockNumber);
      });
    });
  }
}
