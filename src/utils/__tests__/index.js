import { parseUrl } from '..';

test('should parse url', () => {
	const rawUrl = 'https://abc:xyz@scalr.api.appbase.io';
	const { credentials, url } = parseUrl(rawUrl);
	expect(credentials).toBe('abc:xyz');
	expect(url).toBe('https://scalr.api.appbase.io');
});
