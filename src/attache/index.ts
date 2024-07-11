'use strict';

import {attache, data, integrations, Internal} from '@parkhub/attache';// import { DbClient, UserConfig, VendorCredentials } from '../types/attache';

const generateConfig = (): Internal.UserConfig => {
	const dbCredentials: { 
		host: string; 
		port: number; 
		user: string; password: string; database: string; } = JSON.parse(process.env.db as string) as Internal.UserConfig['database'];
	//todo add for other gate validations as they get built
	const tibaCredentials = JSON.parse(process.env.tiba_credentials as string) as Internal.VendorCredentials['tiba'];
	const skidataCredentials = JSON.parse(process.env.skidata_credentials as string) as Internal.VendorCredentials['skidata'];
	return {
		database: dbCredentials,
		vendorCredentials: { tiba: tibaCredentials, skidata: skidataCredentials }
	};
};

export const attacheClient = () => attache(generateConfig());
export const dataClient = () => data(generateConfig());
export const integrationsClient = () => integrations(generateConfig());
