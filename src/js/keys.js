/*
	keyGen is to give unique key to `Cell`s in the data table
	rowKeyGen is the same for rows in the datatable
	dropdownKeyGen is for the dropwown in the settings button.
*/

var keyGen = function(row, element){
    return row['_type']+String(row['_id'])+String(element);
}

var rowKeyGen = function(row){
    return row['_id']+row['_type'];
}

var dropdownKeyGen = function(selection){
	return 'dropdown'+selection;
}