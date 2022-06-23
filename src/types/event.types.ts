export enum EventPhase {
  INITIALIZATION = 'Initialization',
}

export enum EventSection {
  SYSTEM = 'system',
  BALANCES = 'balances',
  TREASURY = 'treasury',
  COMMON = 'common',
}

export enum EventMethod {
  TRANSFER = 'Transfer',
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  ENDOWED = 'Endowed',
  EXTRINSIC_SUCCESS = 'ExtrinsicSuccess',
  COLLECTION_CREATED = 'CollectionCreated',
}

export type EventData = {
  method: EventMethod;
  section: EventSection;
  initialization: boolean;
  extrinsicIndex: number | null;
  amount: null | string;
  index: string;
  phase: EventPhase | object;
  data: object;
};
