import { parseUrl, getHeaders } from '../utils';

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
		return res;
	} catch (error) {
		const errorMessage =
			error.name === 'Error' ? error.message : 'Unable to connect';
		throw new Error(errorMessage);
	}
};

export default testConnection;
