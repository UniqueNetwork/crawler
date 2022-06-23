import { Observable } from 'rxjs';
import { pick } from 'lodash';

import { Injectable, Logger } from '@nestjs/common';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { Utils } from '../utils';

import { BlockData } from '../types/block.types';
import {
  EventData,
  EventMethod,
  EventPhase,
  EventSection,
} from '../types/event.types';
import {
  ExtrinsicData,
  ExtrinsicMethod,
  ExtrinsicSection,
} from '../types/extrinsic.types';

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

  private getTimestampFromExtrinsics(extrinsics): number {
    let timestamp = 0;

    for (const extrinsic of extrinsics) {
      const { method: methodStruct } = extrinsic;
      const { section, method } = methodStruct;
      if (
        section === ExtrinsicSection.TIMESTAMP &&
        method === ExtrinsicMethod.SET
      ) {
        timestamp = methodStruct.toJSON().args.now;
        break;
      }
    }

    return timestamp;
  }

  private parseEventAmount({ phase, method, data, section }): string | null {
    let result = null;
    let amountIndex = null;

    /*
     * Extract amount value from event data.
     * The index of amount value depends on the event section and method values.
     * See: https://polkadot.js.org/docs/substrate/events
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

  private parseEventRecord(rawRecord): EventData {
    const {
      event: { index, method, section, data: rawData },
      phase,
    } = rawRecord;

    const initialization = phase.toHuman() === EventPhase.INITIALIZATION;

    const result = {
      method,
      section,
      initialization,
      extrinsicIndex: initialization ? null : phase.toJSON().applyExtrinsic,
      amount: this.parseEventAmount({ phase, method, section, data: rawData }),
      index: index.toHuman(),
      data: rawData.toHuman(),
      phase: phase.toHuman(),
    };

    return result;
  }

  private parseExtrinsicRecord(rawRecord, index: number): ExtrinsicData {
    const {
      method: { section, method },
      isSigned,
    } = rawRecord.toHuman();

    const result = {
      index,
      section,
      method,
      isSigned,
      signer: isSigned ? rawRecord.signer.toString() : null,
      // args: JSON.stringify(rawRecord.args), // todo: Do we really need these args? Alternative way to get args: rawRecord.method.toJSON().args
      hash: rawRecord.hash.toHex(),
    };

    return result;
  }

  private async getBlockData(blockNumber: number): Promise<BlockData> {
    const blockHash = await this.api.rpc.chain.getBlockHash(blockNumber);

    const [rawRuntimeVersion, rawBlock, apiAt] = await Promise.all([
      this.api.runtimeVersion,
      this.api.rpc.chain.getBlock(blockHash),
      this.api.at(blockHash),
    ]);

    const [rawEvents, rawTotalIssuance] = await Promise.all([
      apiAt.query.system.events(),
      apiAt.query.balances.totalIssuance(),
    ]);

    const rawExtrinsics = rawBlock.block.extrinsics;

    const timestamp = this.getTimestampFromExtrinsics(rawExtrinsics);

    const parsedEvents = (rawEvents as unknown as Array<unknown>).map(
      this.parseEventRecord.bind(this),
    );

    const parsedExtrinsics = (rawExtrinsics as unknown as Array<unknown>).map(
      this.parseExtrinsicRecord.bind(this),
    );

    const result = {
      blockNumber,
      timestamp,
      blockHash: blockHash.toHuman(),
      extrinsics: parsedExtrinsics,
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

  async startListening(): Promise<Observable<BlockData>> {
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

  async getBlockByNumber(blockNumber: number): Promise<Observable<BlockData>> {
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
