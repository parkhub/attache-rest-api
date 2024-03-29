'use strict';

import {attache, data} from '@parkhub/attache';
import { DbClient, UserConfig, VendorCredentials } from '../types/attache';

const generateConfig = (): UserConfig => {
	const dbCredentials: { host: string; port: number; user: string; password: string; database: string; } = JSON.parse(process.env.db as string) as DbClient;
	//todo add for other gate validations as they get built
	const tibaCredentials = JSON.parse(process.env.tiba_credentials as string) as VendorCredentials['tiba'];
	return {
		database: dbCredentials,
		vendorCredentials: { tiba: tibaCredentials }
	};
};

export const attacheClient = () => attache(generateConfig());
export const dataClient = () => data(generateConfig());
