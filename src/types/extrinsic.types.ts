export enum ExtrinsicSection {
  PARACHAIN_SYSTEM = 'parachainSystem',
  TIMESTAMP = 'timestamp',
  UNIQUE = 'unique',
}

export enum ExtrinsicMethod {
  SET_VALIDATION_DATA = 'setValidationData',
  SET = 'set',
}

export type ExtrinsicData = {
  index: number;
  section: ExtrinsicSection;
  method: ExtrinsicMethod;
  isSigned: boolean;
  signer: string | null;
  hash: string;
  args?: unknown;
};
