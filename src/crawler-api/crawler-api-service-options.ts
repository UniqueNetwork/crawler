export interface CrawlerApiServiceOptions {
  wsProviderUrl: string;
}

export const defaultCrawlerServiceOptions: CrawlerApiServiceOptions = {
  wsProviderUrl: 'wss://testnet2.uniquenetwork.io',
};
