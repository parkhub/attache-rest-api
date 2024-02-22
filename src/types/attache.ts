'use strict';

export interface DbClient {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface VendorCredentials {
  tiba?: {
    terminalUser: string;
    terminalPassword: string;
    providerId: string;
    authUser: string;
    authPassword: string;
  }
}
export interface UserConfig {
    database: DbClient;
    vendorCredentials?: VendorCredentials,
    coreAesSecret?: string;
  }

export enum Source {
    axs = 'axs',
    seatgeek = 'seatgeek',
    ticketmaster = 'ticketmaster',
    tiba = 'tiba'
  }

export interface ExternalDataSchema {
  barcode?: string | null;
  eventName?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  source?: Source | null;
  sectionName?: string | null;
  cancelled?: boolean | null;
  cancellationReason?: string | null;
  externalSourcesLandmarkId?: string | null;
  rainedOut?: boolean | null;
  orphaned?: boolean | null;
  orderId?: string | null;
}

export interface ExternalTransactionSchema {
  id?: string | null;
  orderId?: string | null;
  externalData?: ExternalDataSchema;
  createdAt?: string | null;
  updatedAt: string;
  transactionId: string;
  sourceId: string;
  externalEventId?: string | null;
  eventId?: string | null;
  lotId?: string | null;
  barcode?: string | null;
  redeemed: boolean;
  source: Source;
  customerName?: string | null;
  acctId?: string | null;
  cancelled: boolean;
  cancellationReason?: string | null;
  reported: boolean;
  hold?: string | null;
  passId: number;
  listingId?: string | null;
  transient: boolean;
  uniqueBarcodeEventFlag: boolean;
  externalSourcesLandmarkId?: string | null;
}

export interface AttacheError extends Error {
  isAttacheError?: boolean;
}
