/* eslint-disable @typescript-eslint/no-explicit-any */
import { Internal, Enums } from '@parkhub/attache';
import { isUUID } from '../strings';

export const isTypeofValidIntegration = (integration: unknown): integration is Internal.ValidIntegration => {
	return (
		typeof integration === 'object' &&
      integration !== null &&
      'source' in integration &&
      'esl' in integration &&
      'valid' in integration &&
      typeof integration.valid === 'boolean'
	);
};

export const isSource = (source: any): source is Enums.Source => {
	return Object.values(Enums.Source).includes(source);
};

export const isEsl = (esl: any): boolean => {
	return typeof esl === 'object' 
    && esl.id && isUUID(esl.id) 
    && esl.externalSourceId 
    && isUUID(esl.externalSourceId) 
    && typeof esl.enabled === 'boolean' 
    && esl.landmarkId 
    && isUUID(esl.landmarkId);
};

export const isClient = (client: any): client is Enums.Client => Object.values(Enums.Client).includes(client);