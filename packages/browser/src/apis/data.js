import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

export const addData = async (
	indexName,
	typeName,
	docId,
	rawUrl,
	data,
	version,
) => {
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

		if (version > 5) {
			baseUrl += `?refresh=wait_for`;
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
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
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

export const updateDocument = async ({ index, id, url, document }) => {
	const defaultError = 'Unable to put data';
	try {
		const { url: base } = parseUrl(url);
		const headers = getHeaders(url);
		const customHeaders = getCustomHeaders(index);
		const baseUrl = `${base}/${index}/_update/${id}`;

		const res = await fetch(baseUrl, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'POST',
			body: JSON.stringify({ doc: document }),
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
			);
		}
		return res;
	} catch (error) {
		throw new CustomError(
			error.description || error.message || defaultError,
			error.message,
			error.stack,
		);
	}
};

export const deleteData = async (
	rawUrl,
	indexName,
	typeName,
	queryData,
	version,
) => {
	const defaultError = 'Unable to delete data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);
		let query = {};

		if (Array.isArray(queryData)) {
			query = {
				query: {
					ids: {
						values: queryData,
					},
				},
			};
		} else {
			query = {
				query: queryData,
			};
		}

		const data = {
			...query,
		};
		const res = await fetch(
			`${url}/${indexName}${
				version < 7 ? `/${typeName}` : ''
			}/_delete_by_query?wait_for_completion=true&scroll_size=5000`,
			{
				headers: {
					...headers,
					...convertArrayToHeaders(customHeaders),
				},
				method: 'POST',
				body: JSON.stringify(data),
			},
		).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
			);
		}
		return res;
	} catch (error) {
		throw new CustomError(
			error.description || error.message || defaultError,
			error.message,
			error.stack,
		);
	}
};

export const bulkUpdate = async (
	rawUrl,
	indexName,
	typeName,
	queryData,
	updateData,
	version,
) => {
	const defaultError = 'Unable to update data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(indexName);
		const dataMap = updateData.reduce((str, item) => {
			let tempStr = str;
			if (item.value !== null) {
				tempStr += `ctx._source.${item.field}=`;
				if (typeof item.value === 'string') {
					tempStr += `"${item.value}";`;
				} else {
					tempStr += `${JSON.stringify(item.value)
						.replace(/{/g, '[')
						.replace(/}/g, ']')};`;
				}
			}

			return tempStr;
		}, '');

		let query = {};

		if (Array.isArray(queryData)) {
			query = {
				query: {
					ids: {
						values: queryData,
					},
				},
			};
		} else {
			query = {
				query: queryData,
			};
		}

		const data = {
			...query,
			script: {
				inline: dataMap,
			},
		};

		const res = await fetch(
			`${url}/${indexName}${
				version < 7 ? `/${typeName}` : ''
			}/_update_by_query?conflicts=proceed&wait_for_completion=true&scroll_size=5000`,
			{
				headers: {
					...headers,
					...convertArrayToHeaders(customHeaders),
				},
				method: 'POST',
				body: JSON.stringify(data),
			},
		).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
			);
		}
		return res;
	} catch (error) {
		throw new CustomError(
			error.description || error.message || defaultError,
			error.message,
			error.stack,
		);
	}
};
