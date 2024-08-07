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
import { Internal } from '@parkhub/attache';
import { AttacheError } from '../types/attache';
import { Logger } from '../utils';

const router = Router();


router.post('/smartpass', async (req: PostReservationRequest, res: Response) => {
	const logger = new Logger({
		client: 'loggly',
		name: 'post-reserve-smartpass',
		description: 'creates external gate reservation for smartpass',
		tags: ['reserve', 'smartpass'],
		endpoint: '/reserve/smartpass', 
		method: 'POST'
	});

	const pass = req.body;

	try {
		validateRequired(pass);
		validateOptional(pass);
		validateCreateOrChange(pass);
		validatePost(pass);
	} catch (err) {
		logger.error({
			message: (err as Error).message, 
			error: err, 
			payload: req.body
		}, 'bad-request');
		
		const error = err as Error;

		res.status(400).json({ 
			result: 'invalid', 
			message: error.message, 
			reject: true 
		});
		return;
	}

	try {
		const response = await postHandler(pass);
		
		if ((response.result !== 'valid' && response.reject) || (!response.esl && !response.reservation)) {
			logger.error({
				message: 'Reservation creation failed', 
				error: response, 
				payload: req.body
			}, 'reservation-failed');
			res.status(400).json(response);
			return;
		}

		delete response.reservation?.code;
		delete response.reservation?.description;
		delete response.esl;

		logger.log({
			message: 'Smartpass Reservation Created', 
			response, 
			payload: req.body
		});

		res.status(200).json(response);
	} catch (err) {		
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		const errorKey = incomingError.isAttacheError ? 'package-error' : 'internal-error';
		
		logger.error({ 
			message, 
			error: incomingError, 
			payload: 
			req.body }, errorKey);

		res.status(status).json({result: 'failed', reject: true, message: message});
		return;
	}
});

router.delete('/smartpass', async (req: DeleteReservationRequest, res) => {
	const pass = req.body;
	const logger = new Logger({
		client: 'loggly',
		name: 'delete-reserve-smartpass',
		description: 'deletes external gate reservation for smartpass and cancels external transaction',
		tags: ['reserve', 'smartpass'],
		endpoint: '/reserve/smartpass', 
		method: 'DELETE'
	});
	try {
		validateRequired(pass);
		validateOptional(pass);
		validateDelete(pass);
	} catch (err) {
		logger.error({
			message: (err as Error).message, 
			error: err, 
			payload: req.body
		}, 'bad-request');		
		res.status(400).json({
			result: 'invalid',
			message: (err as Error).message,
			reject: true,
		});
		return;
	}

	try {
		const {eventId, lotId, barcode, integration} = pass;
		const externalTransaction = await dataClient().externalTransaction({eventId, lotId, barcode, externalData: {integrationSource: integration.source} as Internal.ExternalDataSchema}).fetchOne();
		
		if (!externalTransaction) {
			const error = {
				result: 'invalid', 
				message: 'no external transaction found', 
				reject: true
			};

			logger.error({
				message: error.message, 
				error, 
				payload: req.body
			}, 'reservation-deletion-failed');

			return res.status(400).json(error);
		}

		if (externalTransaction.redeemed) {
			const error = {
				result: 'invalid', 
				message: 'redeemed passes cannot be cancelled', 
				reject: true
			};

			logger.error({
				message: error.message, 
				error, 
				payload: req.body
			}, 'reservation-deletion-failed');
			return res.status(400).json(error);
		}

		const response = await attacheClient()
			.reserve()
			.pass({ 
				pass: pass as unknown as Internal.CancelPassParams, 
				validIntegration: integration, 
				externalTransaction 
			}).cancel() as ReserveResponse;		

		if (response.result !== 'cancelled' && response.reject) {

			logger.error({
				message:'Reservation Deletion Falied', 
				error: response, 
				payload: req.body
			}, 'reservation-deletion-failed');

			res.status(400).json(response);
			return;
		}
		
		delete response.reservation?.code;
		delete response.reservation?.description;
		
		const {id, transactionId} = externalTransaction;

		const updateConditions = {
			id, 
			transactionId,
			externalData: {integrationSource: integration.source}
		};
		const updateData = {
			cancelled: true, 
			cancellationReason: 
			'transfer', 
			updatedAt: new Date().toISOString()
		};

		await dataClient().externalTransaction(updateConditions as Partial<Internal.ExternalTransactionSchema>, undefined, updateData).updateOne();
		
		logger.log({
			message: 'Smartpass Reservation Cancelled Successfully', 
			response, 
			payload: req.body
		});
		
		res.status(200).json(response);
	} catch (err) {
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		const errorKey = incomingError.isAttacheError ? 'package-error' : 'internal-error';
		
		logger.error({ 
			message, 
			error: incomingError, 
			payload: 
			req.body }, errorKey);
		
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
