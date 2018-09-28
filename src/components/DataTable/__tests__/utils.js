import { extractColumns } from '../utils';

test('should extract columns', () => {
	const mappings = {
		properties: {
			bryan: 'adams',
			rock: 'roll',
		},
	};
	const res = extractColumns(mappings);
	expect(res).toEqual([
		{
			key: 'bryan',
			dataIndex: 'bryan',
			title: 'bryan',
			width: 300,
		},
		{
			key: 'rock',
			dataIndex: 'rock',
			title: 'rock',
			width: 300,
		},
	]);
});
