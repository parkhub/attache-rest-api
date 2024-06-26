'use strict';

import { Router, Response } from 'express';
import { attacheClient, dataClient } from '../attache';
import {
	DeleteReservationRequest,
	PostReservationRequest,
	ReserveResponse
} from '../types/reserve';
import {validateRequired, validateOptional, validateCreateOrChange, validatePost, validateDelete} from './reserve/validate';
import { postHandler } from './reserve/handlers';
import { AttacheError, Source } from '../types/attache';
const router = Router();


router.post('/smartpass', async (req: PostReservationRequest, res: Response) => {
	const pass = req.body;
	try {
		validateRequired(pass);
		validateOptional(pass);
		validateCreateOrChange(pass);
		validatePost(pass);
	} catch (err) {
		console.error('ERROR:', err);
		const error = err as Error;
		res
			.status(400)
			.json({ result: 'invalid', message: error.message, reject: true });
		return;
	}
	try {
		const response = await postHandler(pass);
		
		if ((response.result !== 'valid' && response.reject) || (!response.esl && !response.reservation)) {
			console.error('ERROR:', response);
			res.status(400).json(response);
			return;
		}

		console.log('ATTACHE RESPONSE', response);

		delete response.reservation?.code;
		delete response.reservation?.description;
		delete response.esl;
		res.status(200).json(response);
	} catch (err) {
		console.error('ERROR:', err);
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		res.status(status).json({result: 'failed', reject: true, message: message});
		return;
	}
});

router.delete('/smartpass', async (req: DeleteReservationRequest, res) => {
	const pass = req.body;
	try {
		validateRequired(pass);
		validateOptional(pass);
		validateDelete(pass);
	} catch (err) {
		console.error('ERROR:', err);
		res.status(400).json({
			result: 'invalid',
			message: (err as Error).message,
			reject: true,
		});
		return;
	}
	try {
		const {eventId, lotId, barcode} = pass;
		const externalTransaction = await dataClient().externalTransaction({eventId, lotId, barcode, redeemed: false, externalData: {integrationSource: Source.tiba}}).fetchOne();
		
		if (!externalTransaction) return res.status(400).json({result: 'invalid', message: 'no external transaction found', reject: true});
	
		const response = await attacheClient()
			.reserve()
			.handler({ pass, externalTransaction })
			.cancel() as ReserveResponse;		
		delete response.reservation?.code;
		delete response.reservation?.description;
		const {id} = externalTransaction;
		await dataClient().externalTransaction({id, externalData: {integrationSource: Source.tiba}}, undefined, {cancelled: true, cancellationReason: 'transfer'}).updateOne();

		if (response.result !== 'cancelled' && response.reject) {
			res.status(400).json(response);
			return;
		}
		res.status(200).json(response);
	} catch (err) {
		console.error('ERROR:', err);
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		res.status(status).json({result: 'failed', reject: true, message: message});
	}
});

// router.post('/', async (req: PostReservationRequest, res: Response) => {
// 	const pass = req.body;

// 	try {
// 		validateRequired(pass);
// 		validateOptional(pass);
// 		validateCreateOrChange(pass);
// 		validatePost(pass);
// 	} catch (err) {
// 		const error = err as Error;
// 		res.status(400)
// 			.json({ result: 'invalid', message: error.message, reject: true });
// 		return;
// 	}
// 	try {
// 		const response = await postHandler(pass);
// 		delete response.reservation?.code;
// 		delete response.reservation?.description;
// 		if (response.result !== 'valid' && response.reject) {
// 			res.status(400).json(response);
// 			return;
// 		}
// 		res.status(200).json(response);
// 	} catch (err) {
// 		console.error(err); //TODO change to signal logger
// 		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
// 		return;
// 	}
// });

// router.put('/', async (req: PutReservationRequest, res: Response) => {
// 	const pass = req.body;
// 	try {
// 		validateRequired(pass);
// 		validateOptional(pass);
// 		validateCreateOrChange(pass);
// 		validatePut(pass);
// 	} catch (err) {
// 		console.error(err); //TODO change to signal logger
// 		res.status(400).json({
// 			result: 'invalid',
// 			message: (err as Error).message,
// 			reject: true,
// 		});
// 		return;
// 	}
// 	try {
// 		const response = await attacheClient()
// 			.reserve()
// 			.handler({ pass })
// 			.update();

// 		if (response.result !== 'updated' && response.reject) {
// 			res.status(400).send(JSON.stringify(response, null, 4));
// 			return;
// 		}
// 		res.status(200).json(response);
// 	} catch (err) {
// 		console.error(err); //TODO change to signal logger
// 		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
// 		return;
// 	}
// });

// router.delete('/', async (req: DeleteReservationRequest, res: Response) => {
// 	const pass = req.body;
// 	try {
// 		validateRequired(pass);
// 		validateOptional(pass);
// 		validateDelete(pass);
// 	} catch (err) {
// 		console.error(err); //TODO change to signal logger
// 		res.status(400).json({
// 			result: 'invalid',
// 			message: (err as Error).message,
// 			reject: true,
// 		});
// 		return;
// 	}
// 	try {
// 		const response = await attacheClient()
// 			.reserve()
// 			.handler({ pass })
// 			.cancel() as ReserveResponse;		
// 		delete response.reservation?.code;
// 		delete response.reservation?.description;
// 		if (response.result !== 'cancelled' && response.reject) {
// 			res.status(400).json(response);
// 		}
// 		res.status(200).json(response);
// 	} catch (err) {
// 		console.error(err); //TODO change to signal logger
// 		res.status(500).json({result: 'failed', reject: true, message: 'Internal Server Error'});
// 		return;
// 	}
// });


export default router;
