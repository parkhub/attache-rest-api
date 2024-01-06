'use strict';

import {attache} from '@parkhub/attache';
import { DbClient, UserConfig, VendorCredentials } from '../types/attache';

const generateConfig = (): UserConfig => {
	const dbCredentials: { host: string; port: number; user: string; password: string; database: string; } = JSON.parse(process.env.DB as string) as DbClient;
	//todo add for other gate validations as they get built
	const tibaCredentials = JSON.parse(process.env.TIBA_CREDENTIALS as string) as VendorCredentials['tiba'];
	return {
		database: dbCredentials,
		vendorCredentials: { tiba: tibaCredentials }
	};
};

export const attacheClient = () => attache(generateConfig());
