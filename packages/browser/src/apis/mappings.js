import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

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
		if (res.status >= 400 || (res.error && res.error.code >= 400)) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status >= 400 ||
					(res.error && res.error.code
						? res.error.code
						: 400)} - ${defaultError}`,
			);
		}
		return res;
	} catch (error) {
		throw new CustomError(
			error.description || defaultError,
			error.message,
			error.stack,
		);
	}
};

const addMapping = async (
	indexName,
	typeName,
	rawUrl,
	field,
	mapping,
	version,
) => {
	const defaultError = 'Unable to add mapping';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);
		const apiUrl = `${url}/${indexName}/_mapping${
			version >= 7 ? '' : `/${typeName}`
		}`;
		const res = await fetch(apiUrl, {
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
		if (res.status >= 400 || (res.error && res.error.code >= 400)) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status >= 400 ||
					(res.error && res.error.code
						? res.error.code
						: 400)} - ${defaultError}`,
			);
		}
		return res;
	} catch (error) {
		throw new CustomError(
			error.description || defaultError,
			error.message,
			error.stack,
		);
	}
};

export { fetchMappings, addMapping };
