import { parseUrl, getHeaders } from '../utils';

const fetchMappings = async (appname, rawUrl) => {
	const defaultError = 'Unable to fetch mappings';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const res = await fetch(`${url}/${appname}/_mapping`, {
			headers,
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		const errorMessage =
			error.name === 'Error' ? error.message : defaultError;
		throw new Error(errorMessage);
	}
};

export default fetchMappings;
