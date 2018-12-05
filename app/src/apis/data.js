import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

export const addData = async (indexName, typeName, docId, rawUrl, data) => {
	const defaultError = 'Unable to put data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);
		let baseUrl = `${url}/${indexName}/${typeName}`;
		let finalData = JSON.stringify(data);

		if (docId && !Array.isArray(data)) {
			baseUrl += `/${docId}`;
		}

		if (Array.isArray(data)) {
			baseUrl += `/_bulk`;
			finalData = '';
			data.forEach(item => {
				finalData += JSON.stringify({
					index: { _index: indexName, _type: typeName },
				});
				finalData += `\n${JSON.stringify(item)}`;
				finalData += `\n`;
			});
		}
		const res = await fetch(`${baseUrl}`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'POST',
			body: finalData,
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${defaultError}`,
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

export const putData = async (indexName, typeName, docId, rawUrl, data) => {
	const defaultError = 'Unable to put data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);

		const res = await fetch(`${url}/${indexName}/${typeName}/${docId}`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'PUT',
			body: JSON.stringify(data),
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${defaultError}`,
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

export const deleteData = async (indexName, typeName, docIds, rawUrl) => {
	const defaultError = 'Unable to delete data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);
		let data = '';
		docIds.forEach(item => {
			data += JSON.stringify({
				delete: { _index: indexName, _type: typeName, _id: item },
			});
			data += `\n`;
		});
		const res = await fetch(`${url}/${indexName}/${typeName}/_bulk`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'POST',
			body: data,
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${defaultError}`,
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
