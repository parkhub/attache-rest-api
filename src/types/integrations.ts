'use strict';

import { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { Enums, Internal } from '@parkhub/attache';


export interface IntegrationsQueryParams {
    lotId: string;
    landmarkId: string;
    eventId?: string;
    client: Enums.Client;
}

type IntegrationsQueryValue = IntegrationsQueryParams[keyof IntegrationsQueryParams]
type IntegrationsQuery = ParsedQs & {
    [key in keyof IntegrationsQueryParams]: IntegrationsQueryValue;
};
export interface GetIntegrationsRequest extends Request {
    query: IntegrationsQuery;
}

export interface GetIntegrationsResponseBody extends Response {
    integrations: Internal.ValidIntegration[];
}