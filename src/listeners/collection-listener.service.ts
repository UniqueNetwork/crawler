import { Injectable, Logger } from '@nestjs/common';
import { PolkadotApiService } from '../polkadot-api/polkadot-api.service';
import { Utils } from '../utils';

import {
  CollectionData,
  CollectionLimitsField,
  CollectionModeField,
  CollectionSponsorshipField,
} from '../types/collection.types';

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

  private processLimitsField(rawLimits): CollectionLimitsField {
    const humanLimits = rawLimits.toJSON();

    return {
      ...humanLimits,
      sponsoredDataRateLimit: Utils.stringOrJson(
        rawLimits.sponsoredDataRateLimit,
      ),
    };
  }

  private processCollectionData(
    collectionId,
    rawCollection,
    rawLimits,
  ): CollectionData {
    return {
      collectionId,
      mode: Utils.stringOrJson(rawCollection.mode) as CollectionModeField,
      name: Utils.vecToString(rawCollection.name),
      description: Utils.vecToString(rawCollection.description),
      owner: rawCollection.owner.toString(),
      tokenPrefix: rawCollection.tokenPrefix.toHuman(),
      sponsorship: Utils.stringOrJson(
        rawCollection.sponsorship,
      ) as CollectionSponsorshipField,
      permissions: rawCollection.permissions.toHuman(),
      tokenPropertyPermissions:
        rawCollection.tokenPropertyPermissions.toHuman(),
      properties: rawCollection.properties.toHuman(),
      readOnly: rawCollection.readOnly.toHuman(),
      limits: this.processLimitsField(rawLimits),
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
