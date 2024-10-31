'use strict';

import {attache, data, integrations, Internal} from '@parkhub/attache';// import { DbClient, UserConfig, VendorCredentials } from '../types/attache';
import { Logger } from '../utils';

const generateConfig = (logSettings: {
	client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
}): Internal.UserConfig => {
	const dbCredentials: { 
		host: string; 
		port: number; 
		user: string; password: string; database: string; } = JSON.parse(process.env.db as string) as Internal.UserConfig['database'];
	//todo add for other gate validations as they get built
	const tibaCredentials = JSON.parse(process.env.tiba_credentials as string) as Internal.VendorCredentials['tiba'];
	const skidataCredentials = JSON.parse(process.env.skidata_credentials as string) as Internal.VendorCredentials['skidata'];
	const amanoCredentials = JSON.parse(process.env.amano_credentials as string) as Internal.VendorCredentials['amano'];

	return {
		database: dbCredentials,
		logger: new Logger(logSettings),
		vendorCredentials: { 
			tiba: tibaCredentials, 
			skidata: skidataCredentials, 
			amano: amanoCredentials 
		}
	};
};

export const attacheClient = (logSettings: {    
	client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
}) => attache(generateConfig(logSettings));
export const dataClient = (logSettings: {    
	client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
}) => data(generateConfig(logSettings));
export const integrationsClient = (logSettings: {    
	client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
}) => integrations(generateConfig(logSettings));
