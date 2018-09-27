import { extractColumns } from '../utils';

test('should extract columns', () => {
	const columns = [];
	const res = extractColumns(columns);
	expect(res).not.toBe(null);
});
