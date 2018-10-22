import { parseUrl, getHeaders } from '../utils';

const addData = async (indexName, typeName, docId, rawUrl, data) => {
	const defaultError = 'Unable to add mapping';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);

		const res = await fetch(`${url}/${indexName}/${typeName}/${docId}`, {
			headers,
			method: 'PUT',
			body: JSON.stringify(data),
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

export default addData;
