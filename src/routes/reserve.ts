'use strict';

import { Router, Response } from 'express';
import { attacheClient } from '../attache';
import {
	CreateOrChangeReservationRequestBody,
	DeleteReservationRequest,
	PostReservationRequest,
	PostReservationRequestBody,
	ReservationRequestBody,
	PutReservationRequest,
	PutReservationRequestBody,
	DeleteReservationRequestBody,
} from '../types/reserve';
import { StringUtils } from '../utils';

const router = Router();

const validateRequired = (body: ReservationRequestBody): boolean => {
	const { landmarkId, lotId, transactionId } = body;
	if (!landmarkId) throw new Error('landmarkId is required');
	if (!lotId) throw new Error('lotId is required');
	if (!transactionId) throw new Error('transactionId is required');
	if (!StringUtils.isUUID(landmarkId)) throw new Error('landmarkId must be a UUID');
	if (!StringUtils.isUUID(lotId)) throw new Error('lotId must be a UUID');
	if (!StringUtils.isUUID(transactionId)) throw new Error('transactionId must be a UUID');
	
	return true;
};

const validateOptional = (body: ReservationRequestBody): boolean => {
	const { operatorId, licensePlate, eventId } = body;
	if (eventId && !StringUtils.isUUID(eventId)) throw new Error('eventId must be a UUID');
	if (licensePlate && typeof licensePlate !== 'string') throw new Error('licensePlate must be a string');
	if (operatorId && !StringUtils.isUUID(operatorId)) throw new Error('operatorId must be a UUID');

	return true;
};

const validatePost = (body: PostReservationRequestBody): boolean => {
	const { barcode } = body;
	
	if (barcode && typeof barcode !== 'string') throw new Error('barcode must be a string');
	
	return true;
};

const validatePut = (body: PutReservationRequestBody): boolean => {
	const {barcode } = body;

	if (!barcode) throw new Error('barcode is required');
	if (typeof barcode !== 'string') throw new Error('barcode must be a string');
	
	return true;
};

const validateCreateOrChange = (body: CreateOrChangeReservationRequestBody): boolean => {
	const {startsAt, total, expiresAt } = body;
	
	if (!startsAt) throw new Error('startsAt is required');
	if (!StringUtils.isUTC(startsAt)) throw new Error('startsAt must be a valid UTC date string');
	if (total && typeof total !== 'number') throw new Error('total must be a number');
	if (expiresAt && !StringUtils.isUTC(expiresAt)) throw new Error('expiresAt must be a valid UTC date string');

	return true;
};

const validateDelete = (body: DeleteReservationRequestBody): boolean => {
	const { barcode } = body;
	if (!barcode) throw new Error('barcode is required');
	if (typeof barcode !== 'string') throw new Error('barcode must be a string');
	return true;
};
router.post('/', async (req: PostReservationRequest, res: Response) => {
	const pass = req.body;

	try {
		validateRequired(pass);
		validateOptional(pass);
		validateCreateOrChange(pass);
		validatePost(pass);
	} catch (err) {
		const error = err as Error;
		res
			.status(400)
			.json({ result: 'invalid', message: error.message, reject: true });
		return;
	}

	try {
		const response = await attacheClient()
			.reserve()
			.handler({ pass })
			.create();

		if (response.result !== 'valid' && response.reject) {
			res.status(400).json(response);
		}
		delete response.reservation.code;
		delete response.reservation.description;
		res.status(200).json(response);
	} catch (err) {
		console.error(err); //TODO change to signal logger
		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
	}
});

router.put('/', async (req: PutReservationRequest, res: Response) => {
	const pass = req.body;
	try {
		validateRequired(pass);
		validateOptional(pass);
		validateCreateOrChange(pass);
		validatePut(pass);
	} catch (err) {
		console.error(err); //TODO change to signal logger
		res.status(400).json({
			result: 'invalid',
			message: (err as Error).message,
			reject: true,
		});
	}
	try {
		const response = await attacheClient()
			.reserve()
			.handler({ pass })
			.update();

		if (response.result !== 'updated' && response.reject) {
			res.status(400).send(JSON.stringify(response, null, 4));
		}
		delete response.reservation.code;
		delete response.reservation.description;
		res.status(200).json(response);
	} catch (err) {
		console.error(err); //TODO change to signal logger
		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
	}
});

router.delete('/', async (req: DeleteReservationRequest, res: Response) => {
	const pass = req.body;
	try {
		validateRequired(pass);
		validateOptional(pass);
		validateDelete(pass);
	} catch (err) {
		console.error(err); //TODO change to signal logger
		res.status(400).json({
			result: 'invalid',
			message: (err as Error).message,
			reject: true,
		});
	}
	try {
		const response = await attacheClient()
			.reserve()
			.handler({ pass })
			.cancel();		
		if (response.result !== 'cancelled' && response.reject) {
			res.status(400).json(response);
		}
		res.status(200).json(response);
	} catch (err) {
		console.error(err); //TODO change to signal logger
		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
	}
});

export default router;
