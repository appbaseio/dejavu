var React = require('react');
var TypeTable = require('./typeTable.jsx');
var DataTable = require('./table/dataTable.jsx');
var FeatureComponent = require('./features/featureComponent.jsx');
var PureRenderMixin = require('react-addons-pure-render-mixin');
// This is the file which commands the data update/delete/append.
// Any react component that wishes to modify the data state should
// do so by flowing back the data and calling the `resetData` function
//here. This is sort of like the Darth Vader - Dangerous and
// Commands everything !
//
// ref: https://facebook.github.io/react/docs/two-way-binding-helpers.html

var HomePage = React.createClass({
    mixins: [PureRenderMixin],

    // The underlying data structure that holds the documents/records
    // is a hashmap with keys as `_id + _type`(refer to keys.js). Its
    // because no two records can have the same _type _id pair, so its
    // easy to check if a record already exists.

    getInitialState: function() {
        return {
            documents: [],
            types: [],
            signalColor: '',
            signalActive: '',
            signalText: '',
            visibleColumns: [],
            hiddenColumns: [],
            sortInfo: {
                active: false
            },
            connect: false,
            filterInfo: {
                active: false,
                applyFilter: this.applyFilter
            },
            infoObj: {
                showing: 0,
                total: 0,
                getOnce: false,
                availableTotal: 0,
                searchTotal: 0,
                userTouchAdd: this.userTouchAdd
            },
            totalRecord: 0,
            pageLoading: false,
            mappingObj: {},
            actionOnRecord: {
                active: false,
                id: null,
                type: null,
                row: null,
                selectedRows: [],
                selectRecord: this.selectRecord,
                updateRecord: this.updateRecord,
                deleteRecord: this.deleteRecord,
                removeSelection: this.removeSelection
            },
            typeInfo: {
                count: 0,
                typeCounter: this.typeCounter
            },
            errorShow: false
        };
    },
    //The record might have nested json objects. They can't be shown
    //as is since it looks cumbersome in the table. What we do in the
    //case of a nested json object is, we replace it with a font-icon
    //(in injectLink) which upon clicking shows a Modal with the json
    //object it contains.

    flatten: function(data, callback) {
        var response = help.flatten(data);
        return callback(response.data, response.fields);
    },
    injectLink: function(data, fields) {
        return data;
    },
    deleteRow: function(index) {
        delete sdata[index];
    },

    //We cannot render a hashmap of documents on the table,
    //hence we convert that to a list of documents every time
    //there is a delete/update/change. This can be more optimised
    //later but it is not that expensive right now, read writes to
    //DOM are much more expensive.

    resetData: function(total) {
        var sortedArray = [];
        sdata_values = [];

        for (each in sdata) {
            sdata_values.push(sdata[each]);
        }
        //if sort is already applied
        if (this.state.sortInfo.active) {
            sortedArray = help.sortIt(sdata_values, this.state.sortInfo.column, this.state.sortInfo.reverse);

        }
        //by default sort it by typename by passing json field
        else {
            sortedArray = help.sortIt(sdata_values, 'json', false);
        }
        var infoObj = this.state.infoObj;
        infoObj.showing = sortedArray.length;
        if (typeof total != 'undefined') {
            infoObj.searchTotal = total;
        }
        data = sortedArray;
        hiddenColumns = this.state.hiddenColumns;
        var visibleColumns = [];
        var availableColumns = [];
        for (var each in sdata) {
            for (column in sdata[each]) {
                if (fixed.indexOf(column) <= -1 && column != '_id' && column != '_type') {
                    if (visibleColumns.indexOf(column) <= -1 && hiddenColumns.indexOf(column) == -1) {
                        visibleColumns.push(column);
                    }
                if(availableColumns.indexOf(column) <= -1)    
                    availableColumns.push(column);
                }
            }
        }
        
        if(availableColumns.length){
            hiddenColumns.forEach(function(col, key){
                if(availableColumns.indexOf(col) <= -1)
                    hiddenColumns.splice(key, 1);
            });
        }

        //set the combined state
        this.setState({
            documents: sortedArray,
            infoObj: infoObj,
            visibleColumns: visibleColumns,
            hiddenColumns: hiddenColumns,
            pageLoading: false
        });
    },

    // Logic to stream continuous data.
    // We call the ``getData()`` function in feed.js
    // which returns a single json document(record).
    updateDataOnView: function(update, total) {
        if (!Array.isArray(update)) {
            update = this.flatten(update, this.injectLink);
            var key = rowKeyGen(update);

            //If the record already exists in sdata, it should
            //either be a delete request or a change to an
            //existing record.
            if (sdata[key]) {
                // If the update has a ``_deleted`` field, apply
                // a 'delete transition' and then delete
                // the record from sdata.
                if (update['_deleted']) {
                    for (var each in sdata[key]) {
                        var _key = keyGen(sdata[key], each);
                        deleteTransition(_key);
                    }
                    deleteTransition(key);
                    this.deleteRow(key);
                    setTimeout(function(callback) {
                        callback();
                    }.bind(null, this.resetData), 1100);
                }

                // If it isn't a delete, we should find a record
                // with the same _type and _id and apply an ``update
                // transition`` and then update the record in sdata.
                //Since sdata is modeled as a hashmap, this is
                //trivial.
                else {
                    sdata[key] = update;
                    this.resetData();
                    for (var each in update) {
                        updateTransition(keyGen(update, each));
                    }
                    var key = rowKeyGen(update);
                    updateTransition(key);
                }
            }
            //If its a new record, we add it to sdata and then
            //apply the `new transition`.
            else {
                sdata[key] = update;
                this.resetData();
                for (var each in update) {
                    var _key = keyGen(update, each);
                    newTransition(_key);
                }
                var _key = rowKeyGen(update);
                newTransition(_key);
            }
            this.setSampleData(update);
        } else { // when update is an array
            for (var each = 0; each < update.length; each++) {
                update[each] = this.flatten(update[each], this.injectLink);
                var key = rowKeyGen(update[each]);
                if (!sdata[key]) {
                    sdata[key] = update[each];
                }
            }
            this.resetData(total);
            this.setSampleData(update[0]);
        }
    },
    countTotalRecord: function(total, fromStream, method){
        var totalRecord = this.state.totalRecord;
        if(fromStream) {
            if(method == 'index')
                totalRecord += 1;
            else if(method == 'delete')
                totalRecord -= 1;
        }
        else
            totalRecord = total
        return totalRecord;
    },
    streamCallback: function(total, fromStream, method) {
        var totalRecord = this.countTotalRecord(total, fromStream, method);
        this.setState({
            totalRecord: totalRecord
        });
    },
    onEmptySelection: function(){
        OperationFlag = false;
        var infoObj = this.state.infoObj;
        infoObj.showing = 0;
        totalRecord = 0;
        sdata = {};
        this.setState({
            infoObj: infoObj,
            totalRecord: totalRecord,
            documents: sdata
        });
    },
    getStreamingData: function(types) {
        if (!OperationFlag) {
            OperationFlag = true;

            //If filter is applied apply filter data
            if (this.state.filterInfo.active) {
                var filterInfo = this.state.filterInfo;
                this.applyFilter(types, filterInfo.columnName, filterInfo.method, filterInfo.value, filterInfo.analyzed);
            }
            //Get the data without filter
            else {
                if (types.length) {
                    d1 = new Date();
                    feed.getData(types, function(update, fromStream, total) {
                        if(subsetESTypes.length)
                            this.updateDataOnView(update, total);
                        else
                            this.updateDataOnView([],0);
                    }.bind(this), function(total, fromStream, method) {
                        this.streamCallback(total, fromStream, method);
                    }.bind(this));
                } else {
                    this.onEmptySelection();
                }
            }
        } else {
            setTimeout(function(){ this.getStreamingData(types) }.bind(this), 300);
        }
    },
    // infinite scroll implementation
    paginateData: function() {
        var filterInfo = this.state.filterInfo;
        var queryBody = null;
        d1 = new Date();
        if (filterInfo.active)
            queryBody = feed.createFilterQuery(filterInfo.method, filterInfo.columnName, filterInfo.value, filterInfo.type, filterInfo.analyzed);
        feed.paginateData(this.state.infoObj.total, function(update) {
            this.updateDataOnView(update);
        }.bind(this), queryBody);
    },
    // only called on change in types.
    getStreamingTypes: function() {
        feed.getTypes(function(update) {
            update = update.sort(function(a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            this.setState({
                types: update,
                connect: true
            });
        }.bind(this));
    },
    removeType: function(typeName) {
        feed.deleteData(typeName, function(data) {
            this.resetData();
        }.bind(this));
    },
    componentDidMount: function() {
        // add a safe delay as app details are fetched from this
        // iframe's parent function.
        this.setMap();
        if(appAuth) {
            setTimeout(this.setMap, 2000)
            setTimeout(this.getStreamingTypes, 2000);
            // call every 1 min.
            mappingInterval = setInterval(this.setMap, 60 * 1000);
            streamingInterval = setInterval(this.getStreamingTypes, 60 * 1000);
            this.getTotalRecord();
        }
    },
    componentDidUpdate: function() {
        var hiddenColumns = this.state.hiddenColumns;
        this.hideAttribute(hiddenColumns, 'hide');
    },
    removeHidden: function() {
        var hiddenColumns = this.state.hiddenColumns;
        this.hideAttribute(hiddenColumns, 'show');
        var visibleColumns = this.state.visibleColumns.concat(hiddenColumns);
        this.setState({
            hiddenColumns: [],
            visibleColumns: visibleColumns
        });
    },
    hideAttribute: function(Columns, method) {
        if(method == 'hide') {
            Columns.forEach(function(col){
                if(document.getElementById(col) == null || document.getElementById(col) == 'null') {}
                else {    
                    document.getElementById(col).style.display = "none";
                    for (var each in sdata) {
                        var key = keyGen(sdata[each], col);
                        document.getElementById(key).style.display = "none"
                    }
                }    
            });
        }
        else if(method == 'show') {
            Columns.forEach(function(col){
                if(document.getElementById(col) == null || document.getElementById(col) == 'null') {}
                else {    
                    document.getElementById(col).style.display = "";
                    for (var each in sdata) {
                        var key = keyGen(sdata[each], col);
                        document.getElementById(key).style.display = ""
                    }
                }    
            });
        }
    },
    getTotalRecord: function() {
        var $this = this;
        if (!this.state.infoObj.getOnce) {
            if (typeof APPNAME != 'undefined') {
                feed.getTotalRecord().on('data', function(data) {
                    var infoObj = $this.state.infoObj;
                    infoObj.getOnce = true;
                    infoObj.availableTotal = data.hits.total;
                    $this.setState({
                        infoObj: infoObj
                    });
                });
            } else
                setTimeout(this.getTotalRecord, 1000);
        }
    },
    watchStock: function(typeName) {
        this.setState({
            sortInfo: {
                active: false
            }
        });
        subsetESTypes.push(typeName);
        this.applyGetStream();
    },
    unwatchStock: function(typeName) {
        this.setState({
            sortInfo: {
                active: false
            }
        });
        subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
        this.removeType(typeName);
        this.getStreamingData(subsetESTypes);
    },
    typeCounter: function() {
        var typeInfo = this.state.typeInfo;
        typeInfo.count++;
        this.setState({
            typeInfo: typeInfo
        });
        this.applyGetStream();
    },
    applyGetStream: function() {
        var typeInfo = this.state.typeInfo;
        if (typeInfo.count >= this.state.types.length) {
            this.getStreamingData(subsetESTypes);
        }
    },
    setMap: function() {
        var $this = this;
        if (APPNAME && !$('.modal-backdrop').hasClass('in')) {
            var getMappingObj = feed.getMapping();
            getMappingObj.done(function(data) {
                mappingObjData = data;
                getMapFlag = true;
                $this.setState({
                    mappingObj: mappingObjData[APPNAME]['mappings']
                });
            }).error(function(xhr){
                if(xhr.status == 401){
                    $this.setState({
                        errorShow: true
                    }); 
                    appAuth = false;
                    clearInterval(mappingInterval);
                    clearInterval(streamingInterval);
                }
            });
        }
    },
    handleScroll: function(event) {
        var scroller = document.getElementById('table-scroller');
        var infoObj = this.state.infoObj;

        // Plug in a handler which takes care of infinite scrolling
        if (subsetESTypes.length && infoObj.showing < infoObj.searchTotal && scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight - 100) {
            this.setState({
                pageLoading: true
            });
            this.paginateData();
        }
    },
    handleSort: function(item, type, eve) {
        order = help.getOrder(item);
        this.setState({
            sortInfo: {
                active: true,
                column: item,
                reverse: order
            }
        });
        var docs = this.state.documents;
        var sortedArray = help.sortIt(docs, item, order);
        this.setState({
            documents: sortedArray
        });
    },
    addRecord: function() {
        var form = $('#addObjectForm').serializeArray();
        this.indexCall(form, 'close-modal', 'index');
    },
    indexCall: function(form, modalId, method) {
        var recordObject = {};
        $.each(form, function(k2, v2) {
            if (v2.value != '')
                recordObject[v2.name] = v2.value;
        });

        recordObject.body = JSON.parse(recordObject.body);
        feed.indexData(recordObject, method, function(newTypes) {
            $('.close').click();
            if (typeof newTypes != 'undefined') {
                this.setState({
                    types: newTypes
                });
                setTimeout(function(){
                    this.setMap();
                }.bind(this),500);
            }
        }.bind(this));
    },
    getTypeDoc: function() {
        var selectedType = $('#setType').val();
        var typeDocSample = this.state.typeDocSample;
        var $this = this;
        if (selectedType != '' && selectedType != null) {
            if (!typeDocSample.hasOwnProperty(selectedType)) {

                feed.getSingleDoc(selectedType, function(data) {
                    try {
                        typeDocSample[selectedType] = data.hits.hits[0]._source;
                        $this.setState({
                            typeDocSample: typeDocSample
                        });
                        $this.showSample(typeDocSample[selectedType]);
                    }
                    catch (err) {
                        console.log(err);
                    }
                });

            } else this.showSample(typeDocSample[selectedType]);
        }
    },
    userTouchFlag: false,
    //If user didn't touch to textarea only then show the json
    showSample: function(obj) {
        if(this.userTouchFlag && $('#setBody').val().trim() != ''){}
        else{
            var convertJson = obj.hasOwnProperty('json') ? obj.json : obj;
            var objJson = JSON.stringify(convertJson, null, 2);
            $('#setBody').val(objJson);
        }
    },
    setSampleData: function(update) {
        if(typeof update != 'undefined'){
            var typeDocSample = this.state.typeDocSample ? this.state.typeDocSample : {};
            typeDocSample[update['_type']] = $.extend({}, update);
            delete typeDocSample[update['_type']]._id;
            delete typeDocSample[update['_type']]._type;
            this.setState({
                typeDocSample: typeDocSample
            });
        }
    },
    //Get the form data in help exportData,
    //Do the test query before exporting data
    exportData: function() {
        var exportObject = help.exportData();
        var $this = this;
        var testQuery = feed.testQuery(exportObject.type, exportObject.query);
        testQuery.on('data', function(res) {
            if (!res.hasOwnProperty('error'))
                $this.exportQuery(exportObject);
            else {
                toastr.error(res.error, 'ES Error : ' + res.status, {
                    timeOut: 5000
                })
                $('#exportBtn').removeClass('loading').removeAttr('disabled');
            }

        }).on('error', function(err) {
            toastr.error(err, 'ES Error', {
                timeOut: 5000
            })
            $('#exportBtn').removeClass('loading').removeAttr('disabled');
        });
    },
    exportQuery: function(exportObject) {
        var url = 'https://accapi.appbase.io/app/' + APPID + '/export';

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(exportObject),
            contentType: "application/text",
            datatype: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                $('#exportBtn').removeClass('loading').removeAttr('disabled');
                $('#close-export-modal').click();
                $('.close').click();
                toastr.success('Data is exported, please check your email : ' + PROFILE.email + '.');
            }
        });
    },
    applyFilter: function(typeName, columnName, method, value, analyzed) {
        filterVal = $.isArray(value) ? value : value.split(',');
        var $this = this;
        var filterObj = this.state.filterInfo;
        filterObj['type'] = typeName;
        filterObj['columnName'] = columnName;
        filterObj['method'] = method;
        filterObj['value'] = filterVal;
        filterObj['active'] = true;
        filterObj['analyzed'] = analyzed;
        this.setState({
            filterInfo: filterObj
        });
        if (typeName != '' && typeName != null) {
            feed.filterQuery(method, columnName, filterVal, subsetESTypes, analyzed, function(update, fromStream, total) {
                if (!fromStream) {
                    sdata = [];
                    $this.resetData(total);
                }
                setTimeout(function() {
                    if (update != null)
                        $this.updateDataOnView(update);
                }, 500);
            }.bind(this), function(total, fromStream, method) {
                this.streamCallback(total, fromStream, method);
            }.bind(this));
        } else {
            this.onEmptySelection();
        }
    },
    removeFilter: function() {
        var $this = this;
        var obj = {
            active: false,
            applyFilter: this.applyFilter
        };
        this.setState({
            filterInfo: obj
        });
        sdata = [];
        $this.resetData();
        setTimeout(function() {
            $this.getStreamingData(subsetESTypes);
        }, 500);
    },
    removeSort: function() {
        var docs = this.state.documents;
        var sortedArray = help.sortIt(docs, '_type', false);
        this.setState({
            documents: sortedArray
        });
        this.setState({
            sortInfo: {
                active: false
            }
        });
    },
    columnToggle: function() {
        var $this = this;
        var obj = {
            toggleIt: function(elementId, checked) {
                if (!checked) {
                    //visible columns - update
                    var visibleColumns = $this.state.visibleColumns.filter(function(v){
                        if (v != elementId) return v;
                    });

                    //hidden columns - update
                    hiddenColumns = $this.state.hiddenColumns;
                    var flag = hiddenColumns.indexOf(elementId);
                    if (flag == -1) {
                        hiddenColumns.push(elementId);
                    }
                } else {
                    //visible columns - update
                    visibleColumns = $this.state.visibleColumns;
                    var flag = visibleColumns.indexOf(elementId);
                    if (flag == -1) {
                        visibleColumns.push(elementId);
                    }

                    //hidden columns - update
                    var hiddenColumns = $this.state.hiddenColumns.filter(function(v){
                        if (v != elementId) return v;
                    });
                }
                $this.setState({
                    visibleColumns: visibleColumns,
                    hiddenColumns: hiddenColumns
                });
            },
            setVisibleColumn: function() {

            }
        };
        return obj;
    },
    selectRecord: function(id, type, row, currentCheck) {
        var actionOnRecord = help.selectRecord(this.state.actionOnRecord, id, type, row, currentCheck);
        this.setState({
            actionOnRecord: actionOnRecord
        });
        this.forceUpdate();
    },
    removeSelection: function() {
        var actionOnRecord = help.removeSelection(this.state.actionOnRecord);
        this.setState({
            actionOnRecord: actionOnRecord
        });
        this.forceUpdate();
        $('[name="selectRecord"]').removeAttr('checked');
    },
    updateRecord: function(json) {
        var form = $('#updateObjectForm').serializeArray();
        var recordObject = {};
        this.indexCall(form, 'close-update-modal', 'update');
    },
    deleteRecord: function() {
        $('.loadingBtn').addClass('loading');
        feed.deleteRecord(this.state.actionOnRecord.selectedRows, function(update) {
            $('.loadingBtn').removeClass('loading');
            $('#close-delete-modal').click();
            $('.close').click();
            var infoObj = this.state.infoObj;
            infoObj.total -= this.state.actionOnRecord.selectedRows.length;

            this.setState({
                infoObj: infoObj
            });

            this.removeSelection();
            this.resetData();
        }.bind(this));
    },                 
    initEs:function(){
        var formInfo = $('#init-ES').serializeArray();
        formInfo.forEach(function(v) {
            if(v.name == 'url'){
                window.localStorage.setItem('esurl',v.value);
            }
            else{
                window.localStorage.setItem('appname',v.value);
            }
        });
        window.location.href = "index.html";
    },
    reloadData:function(){
        this.getStreamingData(subsetESTypes);
    },
    userTouchAdd: function(flag){
        this.userTouchFlag = flag;
    },
    closeErrorModal: function(){
        this.setState({
            errorShow: false
        });
    },
    //The homepage is built on two children components(which may
    //have other children components). TypeTable renders the
    //streaming types and DataTable renders the streaming documents.
    //main.js ties them together.

    render: function() {
        return (<div>
                    <div id='modal' />
                    <div className="row dejavuContainer">
                        <div className="typeContainer">
                            <TypeTable
                                Types={this.state.types}
                                watchTypeHandler={this.watchStock}
                                unwatchTypeHandler={this.unwatchStock}
                                ExportData={this.exportData}
                                signalColor={this.state.signalColor}
                                signalActive={this.state.signalActive}
                                signalText={this.state.signalText}
                                typeInfo={this.state.typeInfo} />
                        </div>
                         <div className="col-xs-12 dataContainer">
                            <DataTable
                                _data={this.state.documents}
                                sortInfo={this.state.sortInfo}
                                filterInfo={this.state.filterInfo}
                                infoObj={this.state.infoObj}
                                totalRecord={this.state.totalRecord}
                                scrollFunction={this.handleScroll}
                                selectedTypes={subsetESTypes}
                                handleSort={this.handleSort}
                                mappingObj={this.state.mappingObj}
                                removeFilter ={this.removeFilter}
                                addRecord = {this.addRecord}
                                getTypeDoc={this.getTypeDoc}
                                Types={this.state.types}
                                removeSort = {this.removeSort}
                                removeHidden = {this.removeHidden}
                                visibleColumns = {this.state.visibleColumns}
                                hiddenColumns = {this.state.hiddenColumns}
                                columnToggle ={this.columnToggle}
                                actionOnRecord = {this.state.actionOnRecord}
                                pageLoading={this.state.pageLoading}
                                reloadData={this.reloadData} />
                        </div>
                        <FeatureComponent.ErrorModal 
                            errorShow={this.state.errorShow}
                            closeErrorModal = {this.closeErrorModal}>
                        </FeatureComponent.ErrorModal>
                    </div>
                </div>);
    }
});

module.exports = HomePage;