/*
	KeyGen is to give unique key to `Cell`s
	rowKeyGen is the same for rows

*/

var keyGen = function(row, element){
    return row['_type']+String(row['_id'])+String(element);
}

var rowKeyGen = function(row){
    return row['_id']+row['_type'];
}

var dropdownKeyGen = function(selection){
	return 'dropdown-'+selection;
}