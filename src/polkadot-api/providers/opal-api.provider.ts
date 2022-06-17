/// <reference types="@unique-nft/types/augment-api-rpc" />
import { Injectable } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { unique } from '@unique-nft/types/definitions';

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

  getApi() {
    return this.api;
  }
}
