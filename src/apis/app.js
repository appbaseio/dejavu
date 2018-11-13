import {
	parseUrl,
	getHeaders,
	isEmptyObject,
	getCustomHeaders,
	convertArrayToHeaders,
} from '../utils';

const testConnection = async (appname, rawUrl) => {
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(appname);

		const res = await fetch(`${url}/${appname}`, {
			'Content-Type': 'application/json',
			headers: { ...headers, ...convertArrayToHeaders(customHeaders) },
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || 'Unable to connect');
		}

		if (isEmptyObject(res)) {
			throw new Error(res.message || 'Index not found');
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export default testConnection;
