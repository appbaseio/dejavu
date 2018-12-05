import getDateFormat, { dateFormatMap } from '../date';

test('snapshot date formats', () => {
	expect(dateFormatMap).toMatchSnapshot();
});

test('should return correct format if it exists', () => {
	const format = 'date';
	const res = getDateFormat(format);
	expect(res).toBe('YYYY-MM-DD');
});

test('should return custom format if it does not exist', () => {
	const format = 'YY/MM/DD';
	const res = getDateFormat(format);
	expect(res).toBe(format);
});
