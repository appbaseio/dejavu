import {
	parseUrl,
	getCustomHeaders,
	convertArrayToHeaders,
	getHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

const getCount = async (app, type, rawUrl) => {
	const defaultError = 'Unable to get count';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(app);

		const res = await fetch(`${url}/${app}/${type}/_count`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'GET',
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

export default getCount;
