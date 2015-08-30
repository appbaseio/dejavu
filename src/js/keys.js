var keyGen = function(row, element){
    return row['_type']+String(row['_id'])+String(element);
}

var rowKeyGen = function(row){
    return row['_id']+row['_type'];
}