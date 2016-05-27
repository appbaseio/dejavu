//Help object which contains the helper function and we can use this in homePage component
var help = {
    flatten: function(data) {
        var fields = [];
        if (data != null) {
            for (var each in data['_source']) {
                data[each] = data['_source'][each];
                if (typeof data[each] !== 'string') {
                    if (typeof data[each] !== 'number') {
                        fields.push(each);
                    }
                }
            }
        }
        data['json'] = data['_source'];
        if (data['_source'])
            delete data['_source'];
        if (data['_index'])
            delete data['_index'];
        if (data['_score'])
            delete data['_score'];

        return {
            data: data,
            fields: fields
        };
    },
    getOrder: function(itemIn) {
        var finalVal = false;
        if (itemIn == this.currentItem) {
            if (!this.currentOrder)
                finalVal = true;
        } else {
            this.currentItem = itemIn;
        }
        this.currentOrder = finalVal;
        return finalVal;
    },
    sortIt: function(arr, prop, reverse) {
        var $this = this;
        var existsOnly = _.filter(arr, function(elm) {
            return typeof elm[prop] != 'undefined'
        });
        var nonExistsOnly = _.filter(arr, function(elm) {
            return typeof elm[prop] == 'undefined'
        });

        var a2 = existsOnly.sort($this.dynamicSort(prop, reverse));
        var a2 = $.merge(a2, nonExistsOnly);
        return a2;
    },
    dynamicSort: function(property, reverse) {
        return function(a, b) {
            sortOrder = reverse ? -1 : 1;
            if (property == 'json')
                property = '_type';
            if (isNaN(a[property]))
                var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
            else
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },
    exportData: function() {
        var form = $('#addObjectForm_export').serializeArray();
        var exportObject = {
            type: [],
            username: PROFILE.name
        };
        form.forEach(function(val) {
            if (val.name == 'type') {
                exportObject.type.push(val.value);
            } else if (val.name == 'body') {
                exportObject.query = JSON.parse(val.value);
            }
        });
        $('#exportBtn').addClass('loading').attr('disabled', true);
        return exportObject;
    },
    selectRecord: function(actionOnRecord, id, type, row, currentCheck, documents) {
        var row = {};
        selectedRows = [];
        $('.rowSelectionCheckbox:checked').each(function(i, v){
            var obj = {
                _id: $(v).attr('value'),
                _type: $(v).data('type')
            };
            selectedRows.push(obj);
            if(i === 0) {
                row = $(v).data('row');
                delete row.json;
                actionOnRecord.id = obj._id;
                actionOnRecord.type = obj._type;
            }
        });
        actionOnRecord.active = selectedRows.length ? true : false;
        actionOnRecord.selectedRows = selectedRows;
        actionOnRecord.row = JSON.stringify(row, null, 4);
        return {
            actionOnRecord: actionOnRecord
        };
    },
    removeSelection: function(actionOnRecord) {
        actionOnRecord.active = false;
        actionOnRecord.id = null;
        actionOnRecord.type = null;
        actionOnRecord.selectedRows = [];
        return {
            actionOnRecord: actionOnRecord
        };
        return actionOnRecord;
    },
    selectAll: function(checked, actionOnRecord, documents) {
        if(checked) {
            actionOnRecord.selectedRows = [];
            _.each(documents, function(ele) {
                var obj = {
                    _id: ele._id,
                    _type: ele._type
                };
                actionOnRecord.selectedRows.push(obj);
            });
        }
        else
            actionOnRecord.selectedRows = this.removeSelection(actionOnRecord);
        
        console.log(actionOnRecord.selectedRows);
        return actionOnRecord;
    }
}