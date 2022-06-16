import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ProviderFactory } from './providerAPI/providerAPI';
import { TypeProvider } from './providerAPI/type/provider';
import runtimeTypes from '../config/runtime_types.json';
import { ApiPromise } from '@polkadot/api';

@Injectable()
export class PolkadotApiService {
  private api: ApiPromise;

  private typeProvider: TypeProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const wsUrl = this.configService.getOption('wsProviderUrl');
    const typeProvider = this.configService.getOption('typeProvider');

    this.typeProvider = typeProvider
      ? TypeProvider[process.env.TYPE_PROVIDER.toUpperCase()]
      : TypeProvider.TESTNET2;

    console.log(wsUrl, this.typeProvider);

    this.getPolkadotAPI(wsUrl, runtimeTypes).then((result) => {
      this.api = result;
    });
  }

  private async getPolkadotAPI(wsUrl, rtt) {
    async function wait(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const log = this.logger;

    log.verbose(`Connecting to ${wsUrl}`);
    const provider = new ProviderFactory(wsUrl, this.typeProvider);
    const api = await provider.getApi(rtt);

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
