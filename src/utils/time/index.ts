import { DateTime } from 'luxon';

export const time = {
	isPast: (timestamp: string): boolean => {
		const now = Date.now();
		const dateToCheck = new Date(timestamp).getTime();
		return dateToCheck < now;
	},
	isUTC: (timestamp: string): boolean => {
		const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
		return regex.test(timestamp) && !isNaN(Date.parse(timestamp));
	},
	normalizeToISO(timestamp: string, zone: string = 'utc'): string {
		let dt = DateTime.fromISO(timestamp, { zone });
		
		if (dt.isValid) {
			return dt.toISO();
		}

		const parsers = [
			(ts: string) => DateTime.fromSQL(ts, { zone }),
			(ts: string) => DateTime.fromRFC2822(ts, { zone }),
			(ts: string) => DateTime.fromHTTP(ts, { zone }),
			(ts: string) => DateTime.fromJSDate(new Date(ts), { zone })
		];

		let index = 0;

		while (index < parsers.length && !dt.isValid) {
			dt = parsers[index++](timestamp);
		}

		// Check if a valid date was found
		if (dt.isValid) {
			return dt.toISO();
		} else {
			throw new Error(`Unable to normalize timestamp: ${timestamp}`);
		}
	}
};