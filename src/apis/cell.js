import appbase from 'appbase-js';
import { parseUrl, getCustomHeaders, convertArrayToHeaders } from '../utils';

const setCellValue = async (app, type, rawUrl, id, property, value) => {
	const customHeaders = getCustomHeaders(app);
	try {
		const { url, credentials } = parseUrl(rawUrl);
		const api = appbase({
			app,
			url,
			credentials,
		});
		api.setHeaders(convertArrayToHeaders(customHeaders));
		const res = await api.update({
			type,
			id,
			body: {
				doc: {
					[property]: value,
				},
			},
		});
		return res;
	} catch (error) {
		const errorMessage = error.statusText || 'Unable to update data';
		throw new Error(errorMessage);
	}
};

export default setCellValue;
