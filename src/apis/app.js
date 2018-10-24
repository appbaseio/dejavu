import { parseUrl, getHeaders, isEmptyObject } from '../utils';

const testConnection = async (appname, rawUrl) => {
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const res = await fetch(`${url}/${appname}`, {
			'Content-Type': 'application/json',
			headers,
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || 'Unable to connect');
		}

		if (isEmptyObject(res)) {
			throw new Error(res.message || 'Index not found');
		}
		return res;
	} catch (error) {
		const errorMessage =
			error.name === 'Error'
				? error.message
				: 'Unable to connect because of Invalid url';
		throw new Error(errorMessage);
	}
};

export default testConnection;
