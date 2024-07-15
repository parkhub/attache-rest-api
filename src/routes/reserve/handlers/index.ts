'use strict';

import { PostReservationRequestBody, ReserveResponse } from '../../../types/reserve';
import { attacheClient } from '../../../attache';

export const postHandler = async(data: PostReservationRequestBody): Promise<ReserveResponse> =>{
	const {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId, integration} = data;
	const response = await attacheClient()
		.reserve()
		.handler({pass: {lotId, landmarkId, startsAt, expiresAt, eventId, licensePlate, operatorId, transactionId}, integration})
		.create();

	return response;
};