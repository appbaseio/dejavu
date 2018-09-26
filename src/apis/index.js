import parseUrl from 'url-parser-lite';

const testConnection = async (appname, url) => {
	try {
		const { auth } = parseUrl(url);
		const headers = {};
		if (auth) {
			headers.Authorization = `Basic ${btoa(auth)}`;
		}
		const requestUrl = auth ? url.replace(`${auth}@`, '') : url;
		const res = await fetch(`${requestUrl}/${appname}`, {
			'Content-Type': 'application/json',
			headers,
		}).then(response => response.json());
		if (res.status >= 400) {
			throw new Error(res.message || 'Unable to connect');
		}
		return res;
	} catch (error) {
		const errorMessage =
			error.name === 'Error' ? error.message : 'Unable to connect';
		throw new Error(errorMessage);
	}
};

export { testConnection };
