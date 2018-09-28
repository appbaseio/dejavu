import { extractColumns } from '../utils';

test('should extract columns', () => {
	const mappings = {
		properties: {
			bryan: 'adams',
			rock: 'roll',
		},
	};
	const res = extractColumns(mappings);
	expect(res).toEqual(['bryan', 'rock']);
});
