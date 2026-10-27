// @flow
const getCsvFields = (visibleColumns: Array<string>): Array<string> => {
	const fields = [...visibleColumns];
	if (!fields.includes('_id')) {
		fields.push('_id');
	}
	return fields;
};

export default getCsvFields;
