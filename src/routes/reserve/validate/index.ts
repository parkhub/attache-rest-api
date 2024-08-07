'use strict';

import { ReservationRequestBody, PostReservationRequestBody, PutReservationRequestBody, CreateOrChangeReservationRequestBody, DeleteReservationRequestBody } from '../../../types/reserve';
import { StringUtils } from '../../../utils';

const validateRequired = (body: ReservationRequestBody): boolean => {
	const { landmarkId, lotId, integration } = body;
	
	if (!landmarkId) throw new Error('landmarkId is required');
	if (!lotId) throw new Error('lotId is required');
	if (!integration) throw new Error('integration is required');
	if (!StringUtils.isUUID(landmarkId)) throw new Error('landmarkId must be a UUID');
	if (!StringUtils.isUUID(lotId)) throw new Error('lotId must be a UUID');
	
	return true;
};

const validateOptional = (body: ReservationRequestBody): boolean => {
	const { operatorId, licensePlate, eventId, transactionId } = body;

	if (eventId && !StringUtils.isUUID(eventId)) throw new Error('eventId must be a UUID');
	if (licensePlate && typeof licensePlate !== 'string') throw new Error('licensePlate must be a string');
	if (operatorId && !StringUtils.isUUID(operatorId)) throw new Error('operatorId must be a UUID');
	if (transactionId && !StringUtils.isUUID(transactionId)) throw new Error('transactionId must be a UUID');

	return true;
};

const validatePost = (body: PostReservationRequestBody): boolean => {
	const { barcode } = body;
	
	if (barcode && typeof barcode !== 'string') throw new Error('barcode must be a string');
	
	return true;
};

const validatePut = (body: PutReservationRequestBody): boolean => {
	const {barcode } = body;

	if (!barcode) throw new Error('barcode is required');
	if (typeof barcode !== 'string') throw new Error('barcode must be a string');
	
	return true;
};

const validateCreateOrChange = (body: CreateOrChangeReservationRequestBody): boolean => {
	const {startsAt, total, expiresAt } = body;
	
	if (!startsAt) throw new Error('startsAt is required');
	if (!StringUtils.isUTC(startsAt)) throw new Error('startsAt must be a valid UTC date string');
	if (total && typeof total !== 'number') throw new Error('total must be a number');
	if (expiresAt && !StringUtils.isUTC(expiresAt)) throw new Error('expiresAt must be a valid UTC date string');

	return true;
};

const validateDelete = (body: DeleteReservationRequestBody): boolean => {
	const { barcode } = body;
	
	if (!barcode) throw new Error('barcode is required');
	if (typeof barcode !== 'string') throw new Error('barcode must be a string');
	
	return true;
};

export {validateCreateOrChange, validateDelete, validateOptional, validatePost, validatePut, validateRequired};