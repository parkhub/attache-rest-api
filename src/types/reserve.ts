'use strict';
import { Request } from 'express';
import { Internal } from '@parkhub/attache';
export interface ReservationRequestBody {
        landmarkId: string;
        lotId: string;
        integration: Internal.ValidIntegration
        eventId?: string;
        operatorId?: string;
        transactionId?: string;
        licensePlate?: string;
}

export interface CreateOrChangeReservationRequestBody {
    total?: number;
    expiresAt?: string;
}
export interface PostReservationRequestBody extends CreateOrChangeReservationRequestBody, ReservationRequestBody {
    startsAt: string;
    barcode?: string;
}
export interface PutReservationRequestBody extends CreateOrChangeReservationRequestBody, ReservationRequestBody {
    barcode: string;
    startsAt?: string;
}

export interface DeleteReservationRequestBody extends ReservationRequestBody {
    barcode: string;
}

export interface PostReservationRequest extends Request {
    body: PostReservationRequestBody;
}


export interface PutReservationRequest extends Request {
    body: PutReservationRequestBody;
}

export interface DeleteReservationRequest extends Request {
    body: DeleteReservationRequestBody;
}

export enum Result {
    invalid = 'invalid',
    valid = 'valid',
    failed = 'failed',
    cancelled = 'cancelled',
    updated = 'updated'
}
export interface ExternalSourcesLandmarkSchema {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
    versionNumber?: string | null;
    lastPing?: string | null;
    landmarkId: string;
    externalSourceId: string;
    tagId?: string | null;
    venueCode?: string | null;
    enabled?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    source?: string | null;
  }
export interface ReserveResponse {
        result: Result;
        message?: string;
        barcode?: { text: string, type: string };
        esl?: ExternalSourcesLandmarkSchema;
        reject: boolean;
        reservation?: {
                code?: string;
                description?: string;
                orderId?: string;
                confirmationCode?: string;
                barcode?: { text: string, type: string };
                startsAt?: string;
                expiresAt?: string;
                facilityCode?: string;
        };
        externalTransactionId?: {id:string}
        test?: boolean;
}

