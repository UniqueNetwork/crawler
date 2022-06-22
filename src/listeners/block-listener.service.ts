import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { pick } from 'lodash';
import { EventMethod, EventPhase, EventSection } from '../constants';
import { Utils } from '../utils';

@Injectable()
export class BlockListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
    private utils: Utils,
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

  private parseEventAmount({ phase, method, data, section }) {
    let result = '0';
    let amountIndex = null;

    /*
     * Extract amount value from event data.
     * The index of amount value depends on the event section and method values.
     * See: https://polkadot.js.org/docs/substrate/events
     *
     * todo: Need to get amount values from all the events that can have ammount values.
     */
    if (
      phase !== EventPhase.INITIALIZATION &&
      [
        EventMethod.TRANSFER,
        EventMethod.DEPOSIT,
        EventMethod.WITHDRAW,
      ].includes(method)
    ) {
      if (section === EventSection.BALANCES) {
        amountIndex =
          method === EventMethod.DEPOSIT || method === EventMethod.WITHDRAW
            ? 1
            : 2;
      } else if (section === EventSection.TREASURY) {
        amountIndex = 0;
      }

      if (amountIndex !== null) {
        result = this.utils.getAmountValue(data[amountIndex].toString());
      }
    }

    return result;
  }

  private parseEventRecord(rawEvent) {
    const {
      event: { index, method, section, data: rawData },
      phase,
    } = rawEvent;

    const result = {
      method,
      section,
      index: index.toHuman(),
      phase: phase.toHuman(),
      data: rawData.toHuman(),
      amount: this.parseEventAmount({ phase, method, section, data: rawData }),
    };

    return result;
  }

  private async getBlockData(blockNumber: number) {
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

    const parsedEvents = (rawEvents as unknown as Array<unknown>).map(
      this.parseEventRecord.bind(this),
    );

    const result = {
      blockNumber,
      timestamp,
      blockHash: blockHash.toHuman(),
      extrinsics: rawBlock.block.extrinsics.toHuman(),
      events: parsedEvents,
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
