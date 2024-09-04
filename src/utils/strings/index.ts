'use strict';
import crypto from 'crypto';

export const isUUID = (uuid: string): boolean => {
	const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return regexExp.test(uuid);
};

export const decryptLicenseHash = (lp: string): string => {
	const key = Buffer.from(process.env.CORE_AES_SECRET as string, 'hex');
	const iv = Buffer.from(lp.substr(0, 32), 'hex');
	const text = lp.substr(32);
  
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
	let decrypted = decipher.update(text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
  
	return decrypted;
};
  