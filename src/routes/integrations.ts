import { Router, Response } from 'express';
import { Internal } from '@parkhub/attache';
import { integrationsClient } from '../attache';
import { GetIntegrationsRequest, IntegrationsQueryParams } from '../types/integrations';
import { validateGet } from './integrations/validate';
import { AttacheError } from '../types/attache';

const router = Router();

router.get('/', async (req: GetIntegrationsRequest, res: Response) => {
	try {
		validateGet(req.query as IntegrationsQueryParams);
	} catch(err) {
		console.error('ERROR:', err);
		const error = err as Error;

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

		console.log(integrations);
        
		res.status(200).json({ integrations: integrations.filter((integration: Internal.ValidIntegration) => integration.supportedClients?.includes(client))});
	} catch (err) {
		console.error('ERROR:', err);
		
		const incomingError = err as Error as AttacheError;
		const message = incomingError.isAttacheError ? incomingError.message : 'Internal Server Error';
		const status = incomingError.isAttacheError ? 400 : 500;
		
		res.status(status).json({result: 'failed', reject: true, message: message});
		return;
	}
});

export default router;