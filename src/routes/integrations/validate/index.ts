'use strict';

import { IntegrationsQueryParams } from '../../../types/integrations';
import { StringUtils } from '../../../utils';

export const validateGet = (body: IntegrationsQueryParams): boolean => {
	const { landmarkId, lotId, client } = body;
	if (!landmarkId) throw new Error('landmarkId is required');
	if (!lotId) throw new Error('lotId is required');
	if (!client) throw new Error('client is required');
	if (!StringUtils.isUUID(landmarkId)) throw new Error('landmarkId must be a UUID');
	if (!StringUtils.isUUID(lotId)) throw new Error('lotId must be a UUID');
	
	return true;
};