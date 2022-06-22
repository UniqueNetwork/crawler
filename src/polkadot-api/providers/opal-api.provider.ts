/// <reference types="@unique-nft/unique-mainnet-types/augment-api-rpc" />
import { Injectable } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { unique } from '@unique-nft/unique-mainnet-types/definitions';

@Injectable()
export class OpalApiProvider {
  protected provider: WsProvider;
  private initialized = false;
  private api: ApiPromise;

  async init(url) {
    if (!this.initialized) {
      this.provider = new WsProvider(url);

      this.api = await ApiPromise.create({
        provider: this.provider,
        rpc: {
          unique: unique.rpc,
        },
      });

      this.initialized = true;
    }
  }

  get isReady() {
    return this.provider.isReady;
  }

  getApi() {
    return this.api;
  }
}
