import { parseUrl } from '../utils';

const testConnection = async (appname, rawUrl) => {
	try {
		const { credentials, url } = parseUrl(rawUrl);
		const headers = {};
		if (credentials) {
			headers.Authorization = `Basic ${btoa(credentials)}`;
		}
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

export { testConnection };
