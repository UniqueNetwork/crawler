import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
export declare class OpalApiProvider {
    protected provider: WsProvider;
    private initialized;
    private api;
    init(url: any): Promise<void>;
    getApi(): ApiPromise;
}
