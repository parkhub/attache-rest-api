'use strict';
import { Request } from 'express';

export interface PostReservationRequestBody {
        landmarkId: string;
        lotId: string;
        eventId: string;
        barcode: string;
        operatorId?: string;
        transactionId: string;
        total?: number;
        licensePlate?: string;
        startsAt: string;
        expiresAt: string;
}

export interface PostReservationRequest extends Request {
    body: PostReservationRequestBody;
}

export enum Result {
    invalid = 'invalid',
    valid = 'valid'
}

export interface AttacheReserveResponse {
        result: Result;
        message?: string;
        barcode?: { text: string, type: string };
        reject: boolean;
}

