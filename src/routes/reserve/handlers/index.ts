'use strict';

import { PostReservationRequestBody, PutReservationRequestBody, ReserveResponse } from '../../../types/reserve';
import { attacheClient, dataClient } from '../../../attache';
import { Internal, Enums } from '@parkhub/attache';
import { TimeUtils } from '../../../utils';
import { LogSettings } from '../../../types';

export const postHandler = async(data: PostReservationRequestBody, logSettings: LogSettings): Promise<ReserveResponse> =>{
	const {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId, integration} = data;
	
	if(integration.source === 'amano') {
		const {ev} = integration;
		const externalValidation = ev as Partial<Internal.ExternalValidationSchema>;

		const result = await dataClient(logSettings).externalValidation({id: externalValidation.id}, Enums.ExternalValidationType.amano, ['externalId']).fetchOneById();

		if(!result) {
			throw new Error('Invalid external validation');
		}

		externalValidation.externalId = result.externalId;
		integration.ev = externalValidation;
	}
	
	const response = await attacheClient(logSettings)
		.reserve()
		.handler({pass: {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId}, integration})
		.create();

	return response as ReserveResponse;
};

export const putHandler = async (data: PutReservationRequestBody, externalTransaction: Internal.ExternalTransactionSchema, logSettings: LogSettings): Promise<ReserveResponse> => {
	const { barcode, lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId, integration} = data;
	const {externalData} = externalTransaction;
	const {startsTime: etStartsAt, endTime: etExpiresAt, externalConfirmationCode, externalOrderId} = externalData as Internal.ExternalDataSchema;
	
	if(integration.source === 'amano') {
		const {ev} = integration;
		const externalValidation = ev as Partial<Internal.ExternalValidationSchema>;

		const result = await dataClient(logSettings).externalValidation({id: externalValidation.id}, Enums.ExternalValidationType.amano, ['externalId']).fetchOneById();

		if(!result) {
			throw new Error('Invalid external validation');
		}
	
		externalValidation.externalId = result.externalId;
		integration.ev = externalValidation;
	}
		
	const startTimestamp = startsAt ?? TimeUtils.normalizeToISO(etStartsAt as string);
	const expireTimestamp = expiresAt ?? TimeUtils.normalizeToISO(etExpiresAt as string);
	const response = await attacheClient(logSettings)
		.reserve()
		.handler({
			pass: {
				barcode, 
				lotId, 
				landmarkId, 
				startsAt: startTimestamp, 
				expiresAt: expireTimestamp, 
				eventId, 
				licensePlate, 
				operatorId, 
				transactionId, 
				externalConfirmationCode, 
				externalOrderId
			}, 
			integration
		})
		.update();

	return response as ReserveResponse;
};