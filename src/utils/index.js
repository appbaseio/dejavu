import urlParser from 'url-parser-lite';

const parseUrl = url => {
	if (!url) {
		return {
			credentials: null,
			url: null,
		};
	}
	const { auth } = urlParser(url);
	const filteredUrl = auth ? url.replace(`${auth}@`, '') : url;
	return {
		credentials: auth,
		url: filteredUrl,
	};
};

export { parseUrl };
