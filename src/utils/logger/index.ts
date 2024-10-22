/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
'use strict';

import { request } from '../request';
import Loggly from 'loggly';
import { AxiosHeaders } from 'axios';
import { Content } from '../../types';

const Signal = require('@parkhub/node-signal-client').default;

const slack = (settings: Logger, output: object) => {
	const { slack_token: token, endpoint, method } = settings;
	if (!token)
		throw new Error('token is not defined for logger client: slack');

	const data = {
		token,
		channel: 'attache-errors',
		blocks: [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*_(SERVICE: attache-rest-api ENV: ${
						process.env.NODE_ENV
					} ENDPOINT: ${endpoint} METHOD: ${method})_*
        \`\`\`${JSON.stringify(Object.assign({}, output), null, 4)}\`\`\``,
				},
			},
		],
	};
	const config = request.config(
		'POST',
      process.env.slack_hook as string,
      {} as AxiosHeaders,
      data
	);
	return request.call(config);
};

const loggly = (settings: Logger): Loggly.LogglyInstance => {
	const { loggly_token: token, subdomain, username, password, tags } = settings;

	return Loggly.createClient({
		token: token,
		subdomain: subdomain,
		auth: {
			username: username,
			password: password,
		},
		tags: tags,
		json: true,
	});
};

export class Logger {
	client: string;
	name: string;
	description: string;
	endpoint: string;
	method: string;
	env: string;
	tags: string[];
	type?: string;
	loggly_token: string;
	slack_token: string;
	username: string;
	password: string;
	subdomain: string;
	log_url: string;
	constructor(settings: {
    client: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    env?: string;
    type?: string;
    tags: string[];
  })  {
		this.client = settings.client;
		this.env = settings.env ?? (process.env.NODE_ENV as string);
		this.type = settings.type;
		this.tags = [`${this.env}-attache-rest-api`, this.env, ...settings.tags];
		this.loggly_token = process.env.loggly_token as string;
		this.slack_token = process.env.slack_token as string;
		this.username = process.env.loggly_username as string;
		this.password = process.env.loggly_password as string;
		this.subdomain = process.env.loggly_subdomain as string;
		this.name = settings.name;
		this.description = settings.description;
		this.endpoint = settings.endpoint;
		this.method = settings.method;
		this.log_url = `${process.env.LOG_BASE_URL}=&from=${new Date().toISOString()}&until=&${new Date().toISOString()}&filter=tag;${this.tags.join('&filter=tag;')}`;
	}
	log(output: object) {
		const { env, type, tags, endpoint, method, log_url } = this;
		const defaults = { env, type, tags, endpoint, method };
		const content =
      typeof output === 'object'
      	? { ...output, ...defaults }
      	: { message: output, ...defaults } as Content;
		
		switch (this.client) {
		case 'slack':
			return slack(this, {message: content.message, logs: log_url});
		case 'loggly':
			try {
				return loggly(this).log(content, tags);
			} catch (error) {
				console.error('Failed to log with Loggly:', error);
				return error;
			}
		default:
			return console.log(content);
		}
	}
	 error(output: Content | string, errorKey: string) {
		const { env, type, tags, name, description, method, endpoint, log_url } = this;
        
		const defaults = { env, type, tags, method, endpoint, isError: true};
		const content = typeof output === 'object' ? { ...output, ...defaults }
			: ({ message: output, ...defaults } as Content);
		if (!this.client || this.client === 'console') return console.log(content);
		// Send a signal alert message
		const signal = new Signal({
			name,
			description,
			environment: process.env.NODE_ENV,
			collection: 'attache-rest-api',
			interval: 5,
			logURL: log_url
		});
		if (this.client === 'loggly') {
			try {
				loggly(this).log(content, [...tags, 'error']);
				signal.sendAlertMessage({
					key: errorKey,
					message: content.message as string,
					level: 'error',
				});
			} catch (err) {
				console.error('Error during primary client logging:', err);
			}
		}
	}
}

