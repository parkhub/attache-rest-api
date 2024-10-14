'use strict';

import { GenericErrorMessage, IntegrationErrorMessage } from '../../../enums/responses';
import { IntegrationsQueryParams } from '../../../types/integrations';
import { StringUtils } from '../../../utils';
import { isClient } from '../../../utils/typeguards';

export const validateGet = (body: IntegrationsQueryParams): boolean => {
	const { landmarkId, lotId, client } = body;
	if (!landmarkId) throw new Error(GenericErrorMessage.LANDMARK_ID_REQUIRED);
	if (!lotId) throw new Error(GenericErrorMessage.LOT_ID_REQUIRED);
	if (!client) throw new Error(IntegrationErrorMessage.CLIENT_REQUIRED);
	if (!isClient(client)) throw new Error(IntegrationErrorMessage.CLIENT_INVALID);
	if (!StringUtils.isUUID(landmarkId)) throw new Error(GenericErrorMessage.LANDMARK_ID_INVALID_FORMAT);
	if (!StringUtils.isUUID(lotId)) throw new Error(GenericErrorMessage.LOT_ID_INVALID_FORMAT);
	
	return true;
};