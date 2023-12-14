'use strict'

import { Knex } from "knex";

export interface UserConfig {
    database: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    },
    vendorCredentials?: VendorCredentials,
    coreAesSecret?: string;
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

  export type DbClient = Knex;