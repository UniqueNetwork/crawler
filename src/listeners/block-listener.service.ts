import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { pick } from 'lodash';

@Injectable()
export class BlockListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
  ) {}

  get api() {
    // todo: Should encapsulate all sraight api calls into apiService methods.
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

  private async getBlockData(blockNumber) {
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

    return result;
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

          const result = await this.getBlockData(blockNumber);

          subscriber.next(result);
        } catch (err) {
          subscriber.error(err?.message);
        }
      });
    });
  }

  async getBlockByNumber(blockNumber: number) {
    // Check api for readiness.
    await this.apiService.isReady;

    return new Observable((subscriber) => {
      try {
        this.logger.verbose(
          `Getting block by number ${blockNumber}`,
          'BlockListenerService',
        );

        this.getBlockData(blockNumber).then((result) => {
          subscriber.next(result);
          subscriber.complete();
        });
      } catch (err) {
        subscriber.error(err?.message);
      }
    });
  }
}
