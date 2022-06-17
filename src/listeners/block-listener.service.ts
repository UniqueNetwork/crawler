import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventMethod, EventSection } from 'src/constants';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { pick } from 'lodash';

@Injectable()
export class BlockListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
  ) {}

  get api() {
    return this.apiService.api;
  }

  private getTimestampFromExtrinsics(extrinsics) {
    for (const extrinsic of extrinsics) {
      const { method } = extrinsic;
      if (method.section === 'timestamp' && method.method === 'set') {
        return method.toJSON().args.now;
      }
    }
  }

  async startListening(): Promise<Observable<unknown>> {
    // Check api for readiness.
    await this.apiService.isReady;

    return new Observable((subscriber) => {
      this.api.rpc.chain.subscribeNewHeads(async (header) => {
        try {
          const blockNumber = header.number.toNumber();

          this.logger.verbose(
            `Got new block ${blockNumber}`,
            'BlockListenerService',
          );

          const blockHash = await this.api.rpc.chain.getBlockHash(blockNumber);

          const [rawBlock, rawRuntimeVersion, rawEvents, rawTotalIssuance] =
            await Promise.all([
              this.api.rpc.chain.getBlock(blockHash),
              this.api.rpc.state.getRuntimeVersion(blockHash),
              this.api.query.system.events.at(blockHash),
              this.api.query.balances.totalIssuance.at(blockHash),
            ]);

          const timestamp = this.getTimestampFromExtrinsics(
            rawBlock.block.extrinsics,
          );

          const result = {
            blockNumber,
            timestamp,
            blockHash: blockHash.toHuman(),
            extrinsics: rawBlock.block.extrinsics.toHuman(),
            events: rawEvents.toHuman(),
            totalIssuance: rawTotalIssuance.toString(),
            ...pick(rawBlock.block.header.toHuman(), [
              'stateRoot',
              'extrinsicsRoot',
              'parentHash',
            ]),
            ...pick(rawRuntimeVersion.toJSON(), ['specName', 'specVersion']),
          };

          subscriber.next(result);
        } catch (err) {
          subscriber.error(err?.message);
        }
      });
    });
  }
}
