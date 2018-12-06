import CustomError from '../utils/CustomError';
import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';

export default async (rawUrl, indexName) => {
	const defaultError = 'Unable to get version';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);

		let fetchUrl = url;
		let fetchHeaders = {};

		const isAppbaseApp = url === 'https://scalr.api.appbase.io';

		if (isAppbaseApp && indexName) {
			fetchUrl = `${url}/${indexName}/_settings`;
			fetchHeaders = convertArrayToHeaders(getCustomHeaders(indexName));
		}

		const res = await fetch(fetchUrl, {
			headers: {
				...headers,
				...fetchHeaders,
			},
			method: 'GET',
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status} - ${defaultError}`,
			);
		}

		let version = '';

		if (isAppbaseApp && indexName) {
			version = res[indexName].settings.index.version.created;
		} else {
			version = res.version.number;
		}

		return version.replace(/\./g, '');
	} catch (error) {
		throw new CustomError(
			error.description || defaultError,
			error.message,
			error.stack,
		);
	}
};
