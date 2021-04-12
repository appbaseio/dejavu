import {
	parseUrl,
	getCustomHeaders,
	convertArrayToHeaders,
	getHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

const search = async (app, type, rawUrl, version, fetchData) => {
	const defaultError = 'Unable to get count';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(app);

		let updatedUrl = `${url}/${app}/_search`;

		if (version < 7) {
			updatedUrl = `${url}/${app}/${type ? `${type}/` : ''}_search`;
		}

		const res = await fetch(updatedUrl, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'POST',
			body: JSON.stringify(fetchData),
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error || res, null, 2),
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
			);
		}
		return res;
	} catch (error) {
		const errorMessage = error.message || defaultError;

		throw new CustomError(
			error.description || errorMessage,
			errorMessage,
			error.stack,
		);
	}
};

export default search;
