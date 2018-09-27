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

// convert search params to object
const getUrlParams = url => {
	if (!url) {
		// treat a falsy value as having no params
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
};

export { parseUrl, getUrlParams };
