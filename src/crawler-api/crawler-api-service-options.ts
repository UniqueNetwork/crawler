import { RandomServiceOptions } from '../random/random-service-options';

export interface CrawlerApiServiceOptions extends RandomServiceOptions {
  wsProviderUrl: string;
  typeProvider?: string;
}

export const defaultCrawlerServiceOptions: CrawlerApiServiceOptions = {
  wsProviderUrl: 'wss://testnet2.uniquenetwork.io',
};
