'use strict';

import { Request, Response, NextFunction } from 'express';

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
	// The expected credentials.
	try {
		const { headers } = req;
		const APP = `${process.env.reserve_app}`;
		const SECRET = `${process.env.reserve_secret}`;
		// Extract the auth header
		const authHeader = headers.authorization;
	
		if (authHeader) {
			// Split on a space, the original authHeader looks like "Basic encodedstring"
			const [scheme, encoded] = authHeader.split(' ');
	
			if (scheme === 'Basic') {
				// Decode the base64 string
				const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
				const [app, secret] = decoded.split(':');
	
				// Check username and password against the expected credentials
				if (app === APP && secret === SECRET) {
					// Authentication successful
					return next();
				}
			}
		}
	
		return res.status(401).json({ message: 'Authentication failed' });
	} catch (err) {
		return res.status(404).json({message: 'Route not found'});
	}
};

export default basicAuth;
