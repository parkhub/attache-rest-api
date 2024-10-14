'use strict';

export enum GenericErrorMessage {
    INTERNAL_SERVER_ERROR='Internal Server Error',
    ATTACHE_ERROR='Unexpected error occurred in attache Package',
    EXTERNAL_TRANSACTION_NOT_FOUND='No external transaction found',
    BARCODE_REQUIRED='barcode is required',
    STARTS_AT_REQUIRED='startsAt is required',
    STARTS_AT_INVALID_FORMAT='startsAt must be a valid UTC date string',
    EXPIRES_AT_REQUIRED='expiresAt is required',
    EXPIRES_AT_INVALID_FORMAT='expiresAt must be a valid UTC date string',
    TOTAL_INVALID_TYPE='total must be a number',
    EVENT_ID_REQUIRED='eventId is required',
    EVENT_ID_INVALID_FORMAT='eventId must be a UUID',
    LANDMARK_ID_REQUIRED='landmarkId is required',
    LANDMARK_ID_INVALID_FORMAT='landmarkId must be a UUID',
    LOT_ID_REQUIRED='lotId is required',
    LOT_ID_INVALID_FORMAT='lotId must be a UUID',
    INTEGRATION_REQUIRED='integration is required',
    INTEGRATION_INVALID_FORMAT='integration must be an object, please call GET /integrations for your landmark/lot for correct values',
    INTEGRATION_INVALID_TYPE='integration must have the following properties: {source: string, valid: boolean, esl: object}, please call GET /integrations for your landmark/lot for correct values',
    INTEGRATION_SOURCE_INVALID='source must be a valid source, please call GET /integrations for your landmark/lot for correct values',
    INTEGRATION_ESL_INVALID='esl must be an object with the following properties: {id: string, externalSourceId: string, enabled: boolean, landmarkId: string}, please call GET /integrations for your landmark/lot for correct values',
    OPERATOR_ID_INVALID_FORMAT='operatorId must be a UUID',
    TRANSACTION_ID_INVALID_FORMAT='transactionId must be a UUID',
    BARCODE_INVALID_TYPE='barcode must be a string'
}



export enum ReserveMessage {
    CREATE_SMARTPASS_SUCCESS='Smartpass Reservation created',
    UPDATE_SMARTPASS_SUCCESS='Smartpass Reservation updated',
    DELETE_SMARTPASS_SUCCESS='Smartpass Reservation deleted'
}

export enum ReserveErrorMessage {
    CREATE_SMARTPASS_FAILED='Smartpass Reservation creation failed',
    UPDATE_SMARTPASS_FAILED='Smartpass Reservation update failed',
    DELETE_SMARTPASS_FAILED='Smartpass Reservation deletion failed',
    REDEEMED_CANCEL_PASS_ERROR='Redeemed passes cannot be cancelled',
    REDEEMED_LICENSE_PLATE_ERROR='License plates cannot be updated on redeemed passes',
    INTEGRATION_NOT_SUPPORTED='integration not supported for the reservation flow, please call GET /integrations for your landmark/lot for correct values',
    LICENSE_PLATE_INVALID_TYPE='licensePlate must be a string'
}

export enum IntegrationErrorMessage{
    CLIENT_REQUIRED='client required',
    CLIENT_INVALID='client must be set to \'prime\' or \'smartpasses\'',
    NO_VALID_INTEGRATIONS='No valid integrations found'
}