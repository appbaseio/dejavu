import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';

export const addData = async (indexName, typeName, docId, rawUrl, data) => {
	const defaultError = 'Unable to put data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);

		const res = await fetch(
			`${url}/${indexName}/${typeName}/${docId}?refresh=true`,
			{
				headers: {
					...headers,
					...convertArrayToHeaders(customHeaders),
				},
				method: 'PUT',
				body: JSON.stringify(data),
			},
		).then(response => response.json());

		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const deleteData = async (indexName, typeName, docIds, rawUrl) => {
	const defaultError = 'Unable to delete data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);

		const res = await fetch(
			`${url}/${indexName}/${typeName}/_delete_by_query?refresh=true`,
			{
				headers: {
					...headers,
					...convertArrayToHeaders(customHeaders),
				},
				method: 'POST',
				body: JSON.stringify({
					query: {
						ids: { values: docIds },
					},
				}),
			},
		).then(response => response.json());

		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};
