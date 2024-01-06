'use strict';
import { Request } from 'express';

export interface ReservationRequestBody {
        landmarkId: string;
        lotId: string;
        eventId?: string;
        operatorId?: string;
        transactionId: string;
        licensePlate?: string;
}

export interface CreateOrChangeReservationRequestBody {
    total?: number;
    startsAt: string;
    expiresAt?: string;
}
export interface PostReservationRequestBody extends CreateOrChangeReservationRequestBody, ReservationRequestBody {
    barcode?: string;
}

export interface PutReservationRequestBody extends CreateOrChangeReservationRequestBody, ReservationRequestBody {
    barcode: string;
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

// export interface AttacheReserveResponse {
//         result: Result;
//         message?: string;
//         barcode?: { text: string, type: string };
//         reject: boolean;
// }

