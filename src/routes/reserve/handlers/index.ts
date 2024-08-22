'use strict';

import { PostReservationRequestBody, PutReservationRequestBody, ReserveResponse } from '../../../types/reserve';
import { attacheClient } from '../../../attache';
import { Internal } from '@parkhub/attache';
import { TimeUtils } from '../../../utils';

export const postHandler = async(data: PostReservationRequestBody): Promise<ReserveResponse> =>{
	const {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId, integration} = data;
	const response = await attacheClient()
		.reserve()
		.handler({pass: {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId}, integration})
		.create();

	return response;
};

export const putHandler = async (data: PutReservationRequestBody, externalTransaction: Internal.ExternalTransactionSchema): Promise<ReserveResponse> => {
	const { barcode, lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId, integration} = data;
	const {externalData} = externalTransaction;
	const {startsTime: etStartsAt, endTime: etExpiresAt, externalConfirmationCode, externalOrderId} = externalData as Internal.ExternalDataSchema;
	
	const startTimestamp = startsAt ?? TimeUtils.normalizeToISO(etStartsAt as string);
	const expireTimestamp = expiresAt ?? TimeUtils.normalizeToISO(etExpiresAt as string);
	const response = await attacheClient()
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

	return response;
};