import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { ConfigService } from '../config/config.service';
import { OpalApiProvider } from './providerAPI/opal-api.provider';

@Injectable()
export class PolkadotApiService {
  private _api: ApiPromise;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly apiProvider: OpalApiProvider,
  ) {
    const wsUrl = this.configService.getOption('wsProviderUrl');

    this.getPolkadotAPI(wsUrl).then((result) => {
      this._api = result;
    });
  }

  get api() {
    return this._api;
  }

  private async getPolkadotAPI(wsUrl) {
    async function wait(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const log = this.logger;

    log.verbose(`Connecting to ${wsUrl}`);

    await this.apiProvider.init(wsUrl);

    const api = this.apiProvider.getApi();

    api.on('error', async (value) => {
      log.error(value);
    });

    api.on('disconnected', async (value) => {
      log.error(value);
    });

    await api.isReady;

    log.verbose('API is ready!');

    // Wait for node is synced
    let node;
    try {
      node = await api.rpc.system.health();
    } catch (e) {
      log.error({
        message: "Can't connect to node! Waiting 10s...",
        name: 'disconnect',
        stack: e.stack,
      });
      api.disconnect();
      await wait(10000);
      throw e;
    }

    log.verbose(`Node: ${JSON.stringify(node)}`);

    if (node && node.isSyncing.eq(false)) {
      // Node is synced!
      log.verbose('Node is synced!');
      return api;
    }

    log.verbose('Node is not synced! Waiting 10s...');

    api.disconnect();

    await wait(10000);

    return api;
  }
}