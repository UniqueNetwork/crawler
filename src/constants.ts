export enum TypeProvider {
  OPAL = 'opal', // wss://ws-opal.unique.network
  WESTEND = 'westend', // wss://westend-opal.unique.network
  QUARTZ = 'quartz', // wss://quartz.unique.network
  TESTNET2 = 'testnet2', // wss://testnet2.uniquenetwork.io
}

export enum SchemaVersion {
  IMAGE_URL = 'ImageURL',
  UNIQUE = 'Unique',
}

export enum EventPhase {
  INITIALIZATION = 'Initialization',
}

export enum EventMethod {
  TRANSFER = 'Transfer',
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  ENDOWED = 'Endowed',
  EXTRINSIC_SUCCESS = 'ExtrinsicSuccess',
}

export enum EventSection {
  SYSTEM = 'system',
  BALANCES = 'balances',
  TREASURY = 'treasury',
}

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
