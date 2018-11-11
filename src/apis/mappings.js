import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';

const fetchMappings = async (appname, rawUrl) => {
	const defaultError = 'Unable to fetch mappings';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(appname);

		const res = await fetch(`${url}/${appname}/_mapping`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

const addMapping = async (indexName, typeName, rawUrl, field, mapping) => {
	const defaultError = 'Unable to add mapping';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);

		const res = await fetch(`${url}/${indexName}/_mapping/${typeName}`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'PUT',
			body: JSON.stringify({
				properties: {
					[field]: mapping,
				},
			}),
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export { fetchMappings, addMapping };
