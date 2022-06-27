import { Injectable, Logger } from '@nestjs/common';
import { UniqueSchema } from '@unique-nft/api';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { Utils } from '../utils';

import { CollectionData } from '../types/collection.types';

@Injectable()
export class CollectionListenerService {
  constructor(
    private readonly logger: Logger,
    private apiService: PolkadotApiService,
    private utils: Utils,
  ) {}

  get api() {
    // todo: Should encapsulate all sraight api calls into apiService methods.
    return this.apiService.api;
  }

  private processCollectionData(
    collectionId,
    rawCollection,
    rawLimits,
  ): CollectionData {
    console.log(rawCollection.toHuman());

    const collectionHuman = rawCollection.toHuman();
    const decodedCollection = UniqueSchema.decode.collectionSchema(
      collectionHuman.properties,
    );

    console.log(decodedCollection);

    return {
      collectionId,
      name: 'Some name',
    };
  }

  async getCollectionById(
    collectionId: number,
  ): Promise<CollectionData | null> {
    // Check api for readiness.
    await this.apiService.isReady;

    const [rawCollectionOption, rawLimitsOption] = await Promise.all([
      this.api.rpc.unique.collectionById(collectionId),
      this.api.rpc.unique.effectiveCollectionLimits(collectionId),
    ]);

    if (rawCollectionOption.isEmpty) {
      return null;
    }

    return this.processCollectionData(
      collectionId,
      rawCollectionOption.value,
      rawLimitsOption.value,
    );
  }
}
