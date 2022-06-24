export declare enum ExtrinsicSection {
    PARACHAIN_SYSTEM = "parachainSystem",
    TIMESTAMP = "timestamp",
    UNIQUE = "unique"
}
export declare enum ExtrinsicMethod {
    SET_VALIDATION_DATA = "setValidationData",
    SET = "set"
}
export declare type ExtrinsicData = {
    index: number;
    section: ExtrinsicSection;
    method: ExtrinsicMethod;
    isSigned: boolean;
    signer: string | null;
    hash: string;
    args?: unknown;
};
