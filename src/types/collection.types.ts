export type CollectionModeField =
  | 'NFT'
  | { fungible?: number; refungible?: number };

export type CollectionPermissionsField = {
  access: 'Normal' | 'AllowList';
  mintMode: null | boolean;
  nesting: {
    tokenOwner: boolean;
    collectionAdmin: boolean;
    restricted: null | boolean;
    permissive: boolean;
  };
};

export type CollectionSponsorshipField =
  | 'Disabled'
  | {
      confirmed?: string;
      unconfirmed?: string;
    };

export type CollectionLimitsField = {
  accountTokenOwnershipLimit: number;
  sponsoredDataSize: number;
  sponsoredDataRateLimit: 'SponsoringDisabled' | { blocks?: number };
  tokenLimit: number;
  sponsorTransferTimeout: number;
  sponsorApproveTimeout: number;
  ownerCanTransfer: boolean;
  ownerCanDestroy: boolean;
  transfersEnabled: boolean;
};

export type CollectionData = {
  collectionId: number;
  mode: CollectionModeField;
  name: string;
  description: string;
  owner: string;
  tokenPrefix: string;
  sponsorship: CollectionSponsorshipField;
  permissions: CollectionPermissionsField;
  tokenPropertyPermissions: {
    key: string;
    permission: {
      mutable: boolean;
      collectionAdmin: boolean;
      tokenOwner: boolean;
    };
  }[];
  properties: { key: string; value: string }[];
  limits: object;
  readOnly: boolean;
};
