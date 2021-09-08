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

		if (indexName) {
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

		if (res.status >= 400 || (res.error && res.error.code >= 400)) {
			throw new CustomError(
				JSON.stringify(res.error, null, 2),
				`HTTP STATUS: ${res.status >= 400 ||
					(res.error && res.error.code
						? res.error.code
						: 400)} - ${defaultError}`,
			);
		}

		let version = '';

		if (indexName) {
			const defaultIndex = Object.keys(res)[0];
			if (defaultIndex) {
				version =
					res[defaultIndex].settings.index.version.upgraded ||
					res[defaultIndex].settings.index.version.created;
			} else {
				version = '7';
			}
		} else {
			version = res.version.number;
		}

		// Handle opensearch version
		if (!version || Number(version[0]) < 5) {
			version = '7';
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
