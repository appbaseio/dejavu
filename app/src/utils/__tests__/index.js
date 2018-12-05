import { parseUrl, getUrlParams, getHeaders } from '..';

test('should parse url', () => {
	const rawUrl = 'https://abc:xyz@scalr.api.appbase.io';
	const { credentials, url } = parseUrl(rawUrl);
	expect(credentials).toBe('abc:xyz');
	expect(url).toBe('https://scalr.api.appbase.io');
});

test('should get url params', () => {
	const testQuery =
		'?appname=good-books-ds&url=https://abc:xyz@scalr.api.appbase.io';
	const expectedQueryObject = {
		appname: 'good-books-ds',
		url: 'https://abc:xyz@scalr.api.appbase.io',
	};
	expect(getUrlParams(testQuery)).toEqual(expectedQueryObject);
});

test('should get headers', () => {
	const rawUrl = 'https://abc:xyz@scalr.api.appbase.io';
	const res = getHeaders(rawUrl);
	const expectedHeaders = {
		'Content-Type': 'application/json',
		Authorization: `Basic ${btoa('abc:xyz')}`,
	};
	expect(res).toEqual(expectedHeaders);
});
