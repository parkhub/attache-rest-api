'use strict';

import { Enums } from '@parkhub/attache';
import { ReservationRequestBody, PostReservationRequestBody, PutReservationRequestBody, CreateOrChangeReservationRequestBody, DeleteReservationRequestBody } from '../../../types/reserve';
import { StringUtils, TimeUtils } from '../../../utils';
import { GenericErrorMessage, ReserveErrorMessage } from '../../../enums/responses';
import { isEsl, isSource, isTypeofValidIntegration } from '../../../utils/typeguards';


const validateRequired = (body: ReservationRequestBody): boolean => {
	const { landmarkId, lotId, integration } = body;
	
	if (!landmarkId) throw new Error(GenericErrorMessage.LANDMARK_ID_REQUIRED);
	if (!lotId) throw new Error(GenericErrorMessage.LOT_ID_REQUIRED);
	if (!integration) throw new Error(GenericErrorMessage.INTEGRATION_REQUIRED);
	if (!isTypeofValidIntegration(integration)) throw new Error(GenericErrorMessage.INTEGRATION_INVALID_FORMAT);
	if (!isSource(integration.source)) throw new Error(GenericErrorMessage.INTEGRATION_SOURCE_INVALID);
	if	(!isEsl(integration.esl)) throw new Error(GenericErrorMessage.INTEGRATION_ESL_INVALID);
	if (!StringUtils.isUUID(landmarkId)) throw new Error(GenericErrorMessage.LANDMARK_ID_INVALID_FORMAT);
	if (!StringUtils.isUUID(lotId)) throw new Error(GenericErrorMessage.LOT_ID_INVALID_FORMAT);
	if (integration.flow !== Enums.TransactionFlow.reserve) throw new Error(ReserveErrorMessage.INTEGRATION_NOT_SUPPORTED);
	if (typeof integration !== 'object') throw new Error(GenericErrorMessage.INTEGRATION_INVALID_FORMAT);
	
	return true;
};

const validateOptional = (body: ReservationRequestBody): boolean => {
	const { operatorId, licensePlate, eventId, transactionId } = body;

	if (eventId && !StringUtils.isUUID(eventId)) throw new Error(GenericErrorMessage.EVENT_ID_INVALID_FORMAT);
	if (licensePlate && typeof licensePlate !== 'string') throw new Error(ReserveErrorMessage.LICENSE_PLATE_INVALID_TYPE);
	if (operatorId && !StringUtils.isUUID(operatorId)) throw new Error(GenericErrorMessage.OPERATOR_ID_INVALID_FORMAT);
	if (transactionId && !StringUtils.isUUID(transactionId)) throw new Error(GenericErrorMessage.TRANSACTION_ID_INVALID_FORMAT);

	return true;
};

const validatePost = (body: PostReservationRequestBody): boolean => {
	const { barcode, startsAt } = body;
	
	if (barcode && typeof barcode !== 'string') throw new Error(GenericErrorMessage.BARCODE_INVALID_TYPE);
	if (!startsAt) throw new Error('startsAt is required');
	if (!TimeUtils.isUTC(startsAt)) throw new Error(GenericErrorMessage.STARTS_AT_INVALID_FORMAT);
	
	return true;
};

const validatePut = (body: PutReservationRequestBody): boolean => {
	const { barcode, startsAt } = body;

	if (!barcode) throw new Error(GenericErrorMessage.BARCODE_REQUIRED);
	if (typeof barcode !== 'string') throw new Error(GenericErrorMessage.BARCODE_INVALID_TYPE);
	if (startsAt && !TimeUtils.isUTC(startsAt)) throw new Error(GenericErrorMessage.STARTS_AT_INVALID_FORMAT);
	
	return true;
};

const validateCreateOrChange = (body: CreateOrChangeReservationRequestBody): boolean => {
	const {total, expiresAt } = body;
	if (expiresAt && !TimeUtils.isUTC(expiresAt)) throw new Error(GenericErrorMessage.EXPIRES_AT_INVALID_FORMAT);
	if (total && typeof total !== 'number') throw new Error(GenericErrorMessage.TOTAL_INVALID_TYPE);


	return true;
};

const validateDelete = (body: DeleteReservationRequestBody): boolean => {
	const { barcode } = body;
	
	if (!barcode) throw new Error(GenericErrorMessage.BARCODE_REQUIRED);
	if (typeof barcode !== 'string') throw new Error(GenericErrorMessage.BARCODE_INVALID_TYPE);
	
	return true;
};

export {validateCreateOrChange, validateDelete, validateOptional, validatePost, validatePut, validateRequired};