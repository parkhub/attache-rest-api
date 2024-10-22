/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

export interface Content {
    message?: string;
    [key: string]: any;
  }

export interface LogSettings {
    client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
  }