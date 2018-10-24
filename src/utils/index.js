import urlParser from 'url-parser-lite';

import getDateFormat from './date';

const parseUrl = url => {
	if (!url) {
		return {
			credentials: null,
			url: null,
		};
	}
	const { auth } = urlParser(url);
	const filteredUrl = auth ? url.replace(`${auth}@`, '') : url;
	return {
		credentials: auth,
		url: filteredUrl,
	};
};

// convert search params to object
const getUrlParams = url => {
	if (!url) {
		// treat a falsy value as having no params
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
};

const getHeaders = rawUrl => {
	const headers = {
		'Content-Type': 'application/json',
	};
	if (!rawUrl) {
		return headers;
	}
	const { credentials } = parseUrl(rawUrl);

	if (credentials) {
		headers.Authorization = `Basic ${btoa(credentials)}`;
	}
	return headers;
};

const isVaildJSON = str => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

const isEmptyObject = obj => {
	if (obj === null) return true;
	if (!Object.keys(obj).length) return true;
	return false;
};

function isObject(obj) {
	return obj !== undefined && obj !== null && obj.constructor === Object;
}

export {
	parseUrl,
	getUrlParams,
	getHeaders,
	getDateFormat,
	isVaildJSON,
	isEmptyObject,
	isObject,
};
