//	keyGen is to give unique key to `Cell`s in the data table
const keyGen = function (row, element) {
	return row._type + String(row._id) + String(element);
};

//	rowKeyGen is the same for rows in the datatable
const rowKeyGen = function (row) {
	return row._id + row._type;
};

//	dropdownKeyGen is for the dropwown in the settings button.
const dropdownKeyGen = function (selection) {
	return `dropdown${selection}`;
};

//	filter key gen is for the dropwown in the filter.
const filterKeyGen = function (column, field) {
	column = column.replace(/\s/, "");
	field = field.replace(/\s/, "");
	return `filter${column}${field}`;
};

module.exports = {
	keyGen,
	rowKeyGen,
	dropdownKeyGen,
	filterKeyGen
};
