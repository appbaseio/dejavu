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
			throw new Error(res.message || 'Error: Unable to connect');
		}

		if (isEmptyObject(res)) {
			throw new Error(res.message || 'Error: Index not found');
		}
		return res;
	} catch (error) {
		let message = error;

		if (error.toString().indexOf('TypeError: Failed to fetch') > -1) {
			message = 'Error: Invalid connection string or index name';
		}

		throw new Error(message);
	}
};

export default testConnection;
