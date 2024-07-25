import { Router, Response } from 'express';
import { Internal } from '@parkhub/attache';
import { integrationsClient } from '../attache';
import { GetIntegrationsRequest, IntegrationsQueryParams } from '../types/integrations';
import { validateGet } from './integrations/validate';
import { AttacheError } from '../types/attache';
import { Logger } from '../utils/logger';

const router = Router();

router.get('/', async (req: GetIntegrationsRequest, res: Response) => {
	const logger = new Logger({
		client: 'loggly',
		name: 'get-integrations',
		description: 'fetch valid integrations for a given lot and landmark',
		tags: ['integrations'],
		endpoint: '/integrations', 
		method: 'GET'
	});

	if (!req.query) {
		logger.error('No query parameters provided', 'bad-request');
		res.status(400).json({result: 'invalid', message: 'No query parameters provided', reject: true});
		return;
	}
	try {
		validateGet(req.query as IntegrationsQueryParams);
	} catch(err) {
		const error = err as Error;		

		logger.error({message: error.message, error, queryStringParameters: req.query}, 'bad-request');
		
		res.status(400).json({ 
			result: 'invalid', 
			message: error.message, 
			reject: true 
		});

		return;
	}
	try {
		const { eventId, lotId, landmarkId, client } = req.query as IntegrationsQueryParams;
    
		const integrations = await integrationsClient().fetchHandler({lotId, landmarkId, eventId}).all();

		logger.log({
			message: `Valid integrations found for landmark: ${landmarkId}`, 
			integrations, 
			queryStringParameters: req.query
		});
        
		res.status(200).json({ integrations: integrations.filter((integration: Internal.ValidIntegration) => integration.supportedClients?.includes(client))});
	} catch (err) {
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		const errorKey = incomingError.isAttacheError ? 'package-error' : 'internal-error';

		if(incomingError.message === 'No valid integrations found') {
			// this would only happen if there were no valid configured attache supported integrations
			// would want to log the error but not return a 400 in this case
			logger.error({ message: 'No valid integrations found', queryStringParameters: req.query }, 'no-valid-integrations');
			res.status(200).json({integrations: []});
			return;
		}
		
		logger.error({ message, error: err, queryStringParameters: req.query }, errorKey);
		res.status(status).json({result: 'failed', reject: true, message: message});

		return;
	}
});

export default router;