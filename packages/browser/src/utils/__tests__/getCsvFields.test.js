import getCsvFields from '../getCsvFields';

describe('getCsvFields', () => {
	it('adds _id without mutating the visible columns from Redux', () => {
		const visibleColumns = ['title', 'status'];

		const fields = getCsvFields(visibleColumns);

		expect(fields).toEqual(['title', 'status', '_id']);
		expect(visibleColumns).toEqual(['title', 'status']);
		expect(fields).not.toBe(visibleColumns);
	});

	it('does not add a duplicate _id column', () => {
		expect(getCsvFields(['title', '_id'])).toEqual(['title', '_id']);
	});
});
