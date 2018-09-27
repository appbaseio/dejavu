import urlParser from 'url-parser-lite';

const parseUrl = url => {
	const { auth } = urlParser(url);
	const filteredUrl = auth ? url.replace(`${auth}@`, '') : url;
	return {
		credentials: auth,
		url: filteredUrl,
	};
};

export { parseUrl };
