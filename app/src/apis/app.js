import {
	parseUrl,
	getHeaders,
	isEmptyObject,
	getCustomHeaders,
	convertArrayToHeaders,
} from '../utils';
import CustomError from '../utils/CustomError';

const testConnection = async (appname, rawUrl, reqHeaders = []) => {
	const defaultError = 'Unable to connect';
	try {
		const { url } = parseUrl(rawUrl);
		const headers = getHeaders(rawUrl);
		const storageHeaders = getCustomHeaders(appname);
		const customHeaders = reqHeaders.length ? reqHeaders : storageHeaders;

		const res = await fetch(`${url}/${appname}`, {
			'Content-Type': 'application/json',
			headers: { ...headers, ...convertArrayToHeaders(customHeaders) },
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

		if (isEmptyObject(res)) {
			throw new CustomError(
				JSON.stringify(
					{
						error: `Unable to find ${appname}`,
					},
					null,
					2,
				),
				`Error: Index not found`,
			);
		}
		return res;
	} catch (error) {
		const err = error;
		let description = `<b> Possible Errors </b>
		<ul><li>Invalid connection string or index name </li>
		<li> Please check if Elasticsearch cluster is up and running</li></ul>`;

		if (err.message === 'Failed to fetch') {
			err.message = defaultError;
		}

		if (err.message === 'NetworkError when attempting to fetch resource.') {
			description = `You are trying to load http content over https.
				You might have to enable mixed content of your browser
				<a target="_blank" href="https://kb.iu.edu/d/bdny">https://kb.iu.edu/d/bdny</a>`;
		}

		throw new CustomError(
			err.description && !isEmptyObject(JSON.parse(err.description))
				? err.description
				: description,
			err.message || defaultError,
			err.stack,
		);
	}
};

export default testConnection;
