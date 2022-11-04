import { unflatten } from 'flat';

import {
	parseUrl,
	getCustomHeaders,
	convertArrayToHeaders,
	getHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

const setCellValue = async (app, type, rawUrl, id, property, value) => {
	const defaultError = 'Unable to update data';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(app);
		const doc = unflatten({ [property]: value });
		const formattedId = encodeURIComponent(id);

		const res = await fetch(`${url}/${app}/_update/${formattedId}`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			method: 'POST',
			body: JSON.stringify({ doc }),
		}).then(response => response.json());

		if (res.status >= 400) {
			throw new CustomError(
				JSON.stringify(res.error || res, null, 2),
				`HTTP STATUS: ${res.status} - ${res.message || defaultError}`,
			);
		}
		return res;
	} catch (error) {
		const errorMessage = error.message || 'Unable to update data';

		throw new CustomError(
			error.description || errorMessage,
			errorMessage,
			error.stack,
		);
	}
};

export default setCellValue;
