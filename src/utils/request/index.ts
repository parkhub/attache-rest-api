'use strict';

import axios, { AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export const request = {
	/**
   * axios request wrapper
   * @param {Object} config REQUIRED request configuration
   * @returns {Object} http response
   */
	call: async (config: AxiosRequestConfig) => {
		return await axios(config);
	},
	/**
   * formats request config for axios
   * @param {string} method REQUIRED POST/GET/PUT/PATCH/DELETE/OPTIONS/HEAD
   * @param {string} url REQUIRED Request URL
   * @param {Object} headers REQUIRED Request Headers
   * @param {Object} payload Request Body
   * @param {string} contentType defaults to 'application/json'
   * @param {number} timeout in miliseconds, defaults to 0
   * @param {Object} custom additional properties for request config see https://axios-http.com/docs/req_config
   * @param {number} maxBodyLength defaults to 2000
   * @returns {Object} request config
   */
	config: (
		method: string,
		url: string,
		headers: RawAxiosRequestHeaders | AxiosHeaders,
		payload: object,
		contentType = 'application/json',
		timeout = 0,
		custom = {},
		maxBodyLength = 2000
	) => ({
		method,
		url,
		maxBodyLength,
		headers: {
			'Content-Type': headers['Content-Type'] || contentType,
			...headers,
		},
		data: payload,
		timeout,
		...custom,
	}),
	/**
   * generates a url query string from an object
   * @param {Object} data
   * @returns {string} query string
   */
	generateQueryString: (data: object) =>
		Object.entries(data)
			.map(([key, value]) => `${key}=${value}`)
			.join('&'),
};
