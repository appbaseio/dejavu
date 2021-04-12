import urlParser from 'url-parser-lite';

import getDateFormat from './date';

import { LOCAL_CONNECTIONS } from '../constants';

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

const isObject = obj =>
	obj !== undefined && obj !== null && obj.constructor === Object;

const updateQueryStringParameter = (uri, key, value) => {
	const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
	const separator = uri.indexOf('?') !== -1 ? '&' : '?';
	if (uri.match(re)) {
		return uri.replace(re, `$1${key}=${value}$2`);
	}
	return `${uri}${separator}${key}=${value}`;
};

// get localStorage data
const getLocalStorageItem = item => window.localStorage.getItem(item) || null;

// set localStorage data
const setLocalStorageData = (item, data) =>
	window.localStorage.setItem(item, data);

const numberWithCommas = x =>
	x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const getOnlySource = data => {
	const {
		_id,
		_index,
		_type,
		_score,
		_click_id, // eslint-disable-line
		highlight,
		sort,
		...others
	} = data;
	return others;
};

const convertArrayToHeaders = data => {
	const headers = {};
	if (data.length) {
		data.forEach(item => {
			headers[item.key] = item.value;
		});

		return headers;
	}

	return {};
};

const saveAppToLocalStorage = (appname, url) => {
	let localConnections = JSON.parse(getLocalStorageItem(LOCAL_CONNECTIONS));

	if (!localConnections) {
		localConnections = { pastApps: [] };
	}

	const { pastApps } = localConnections;

	const currentApp = pastApps.findIndex(item => item.appname === appname);

	if (currentApp === -1) {
		pastApps.push({
			appname,
			url,
			headers: [],
		});
	} else {
		pastApps[currentApp] = {
			appname,
			url,
			...pastApps[currentApp],
		};
	}

	setLocalStorageData(LOCAL_CONNECTIONS, JSON.stringify({ pastApps }));
};

const getCustomHeaders = appname => {
	let localConnections = JSON.parse(getLocalStorageItem(LOCAL_CONNECTIONS));

	if (!localConnections) {
		setLocalStorageData(
			LOCAL_CONNECTIONS,
			JSON.stringify({
				pastApps: [],
			}),
		);

		localConnections = { pastApps: [] };
	}

	const { pastApps } = localConnections;

	if (pastApps) {
		const currentApp = pastApps.find(item => item.appname === appname);

		if (currentApp && currentApp.headers) {
			return currentApp.headers.filter(item => item.key && item.value);
		}
	}

	return [];
};

const isMultiIndexApp = appname =>
	appname.indexOf('*') > -1 || appname.indexOf(',') > -1;

const isEqualArray = (array1 = [], array2 = []) => {
	if (array1.length !== array2.length) {
		return false;
	}

	// eslint-disable-next-line
	for (let i = 0; i < array1.length; i++) {
		if (array1[i]._id !== array2[i]._id) {
			return false;
		}
	}

	return true;
};

const isExtension = () => window.location.href.indexOf('chrome-extension') > -1;

const trimUrl = url => {
	if (url.lastIndexOf('/') === url.length - 1) {
		return url.slice(0, -1);
	}

	return url;
};

const convertToMax = (number, max) => {
	const numberLength = number.toString().length;
	const maxLength = max.toString().length;
	if (numberLength !== maxLength) {
		return '0'.repeat(maxLength - numberLength) + number.toString();
	}

	return number;
};

const normalizeSearchQuery = query => {
	let normalizedQuery = query;
	if (normalizedQuery && normalizedQuery[1] === '&') {
		normalizedQuery = normalizedQuery.replace('&', '');
	}

	return normalizedQuery;
};

export {
	parseUrl,
	getUrlParams,
	getHeaders,
	getDateFormat,
	isVaildJSON,
	isEmptyObject,
	isObject,
	updateQueryStringParameter,
	getLocalStorageItem,
	setLocalStorageData,
	numberWithCommas,
	getOnlySource,
	convertArrayToHeaders,
	getCustomHeaders,
	isMultiIndexApp,
	isEqualArray,
	saveAppToLocalStorage,
	trimUrl,
	convertToMax,
	normalizeSearchQuery,
	isExtension,
};
