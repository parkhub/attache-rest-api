'use strict'

// src/routes.ts
import { Router, Response } from 'express';
import { attache } from '@parkhub/attache'
import { PostReservationRequest, PostReservationRequestBody } from '../types/eventPass';
import { StringUtils, AWSUtils } from '../utils';
import { VendorCredentials, DbClient, UserConfig } from '../types/attache';


const router = Router();

const validatePostReserve = (body: PostReservationRequestBody, eventRequired: boolean): boolean => {
    const { landmarkId, lotId, eventId, barcode, transactionId, total, licensePlate, operatorId, startsAt, expiresAt } = body;
    if (!landmarkId) throw new Error('landmarkId is required');
    if (!lotId) throw new Error('lotId is required');
    if (!eventId && eventRequired) throw new Error('eventId is required');
    if (!barcode) throw new Error('barcode is required');
    if (!transactionId) throw new Error('transactionId is required');
    if (total && typeof total !== 'number') throw new Error('total must be a number');
    if (licensePlate && typeof licensePlate !== 'string') throw new Error('licensePlate must be a string');
    if (operatorId && !StringUtils.isUUID(operatorId)) throw new Error('operatorId must be a string');
    if (!StringUtils.isUUID(landmarkId)) throw new Error('landmarkId must be a UUID');
    if (!StringUtils.isUUID(lotId)) throw new Error('lotId must be a UUID');
    if (!startsAt) throw new Error('startsAt is required');
    if (!expiresAt) throw new Error('expiresAt is required');
    if (!StringUtils.isUTC(startsAt)) throw new Error('startsAt must be a valid UTC date string');
    if (!StringUtils.isUTC(expiresAt)) throw new Error('expiresAt must be a valid UTC date string');


    return true



}
router.post('/event', async (req: PostReservationRequest, res: Response) => {
    const pass = req.body;

    try {
        validatePostReserve(pass, true);
    } catch (err) {
        const error = err as Error;
        res.status(400).send(error.message);
        return;
    }

    try {
        const dbCredentials = JSON.parse(process.env.DB as string) as DbClient;
        //todo add for other gate validations as they get built
        const tibaCredentials = JSON.parse(process.env.TIBA_CREDENTIALS as string) as VendorCredentials;
        const config = {
            database: dbCredentials,
            vendorCredentials: { tiba: tibaCredentials }
        }
        const reservation = await attache(config as unknown as UserConfig).reserveEventHandler({ pass });

        if (reservation.result !== 'valid' && reservation.reject) {
            res.status(400).send('No valid passes found');
        }
        res.status(200).json(reservation);
    } catch (err) {
        console.error(err); //TODO change to signal logger
        res.status(500).send('Internal Server Error');
    }
});

// You can add more routes here

export default router;
