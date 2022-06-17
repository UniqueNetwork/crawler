import { ApiPromise } from '@polkadot/api';
import { TypeProvider } from '../../constants';
import { OpalAPI } from './bridgeProviderAPI/concreate/opalAPI';
import { TestnetAPI } from './bridgeProviderAPI/concreate/testnetAPI';
import { ImplementOpalAPI } from './bridgeProviderAPI/implement/implementOpalAPI';
import { ImplementTestnetAPI } from './bridgeProviderAPI/implement/implemnetTestnetAPI';

export class BridgeAPI {
  constructor(private api: ApiPromise, private typeProvider: TypeProvider) {}

  get bridgeAPI() {
    switch (this.typeProvider) {
      case TypeProvider.OPAL:
      case TypeProvider.QUARTZ:
      case TypeProvider.WESTEND:
        return new OpalAPI(new ImplementOpalAPI(this.api));
      case TypeProvider.TESTNET2:
        return new TestnetAPI(new ImplementTestnetAPI(this.api));
    }
  }
}
