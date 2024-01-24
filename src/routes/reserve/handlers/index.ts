'use strict';

import { PostReservationRequestBody, ReserveResponse } from '../../../types/reserve';
import { attacheClient } from '../../../attache';


export const postHandler = async(pass: PostReservationRequestBody): Promise<ReserveResponse> =>{
	const response = await attacheClient()
		.reserve()
		.handler({ pass })
		.create();

	return response;
};