import {
	parseUrl,
	getHeaders,
	convertArrayToHeaders,
	getCustomHeaders,
} from '../utils';

const fetchTermsAggregations = async (appname, rawUrl, fields) => {
	const defaultError = 'Unable to fetch mappings';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const customHeaders = getCustomHeaders(appname);
		const aggs = {};

		fields.forEach(item => {
			aggs[item] = {
				terms: {
					field: item,
				},
			};
		});
		const res = await fetch(`${url}/${appname}/_search`, {
			headers: {
				...headers,
				...convertArrayToHeaders(customHeaders),
			},
			body: JSON.stringify({
				aggs,
			}),
			method: 'POST',
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || defaultError);
		}
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export default fetchTermsAggregations;
