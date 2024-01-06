'use strict'

import { Knex } from "knex";
import { createInterface } from "node:readline/promises";

export interface DbClient {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

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