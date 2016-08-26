var React = require('react');
var TypeTable = require('./TypeTable.jsx');
var DataTable = require('./table/DataTable.jsx');
var FeatureComponent = require('./features/FeatureComponent.jsx');
var ShareLink = require('./features/ShareLink.jsx');
var AppSelect = require('./AppSelect.jsx');
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
                selectToggle: false,
                selectedRows: [],
                selectRecord: this.selectRecord,
                updateRecord: this.updateRecord,
                deleteRecord: this.deleteRecord,
                removeSelection: this.removeSelection,
                selectToggleChange: this.selectToggleChange,
                getUpdateObj: this.getUpdateObj
            },
            typeInfo: {
                count: 0,
                typeCounter: this.typeCounter
            },
            errorShow: false,
            historicApps: [],
            url: '',
            appname: '',
            splash: true,
            hideUrl: false
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

        //set url
        input_state.visibleColumns = visibleColumns;
        input_state.hiddenColumns = hiddenColumns;
        createUrl(input_state);
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

        //Set sort from url
        if(decryptedData.sortInfo) {
            this.handleSort(decryptedData.sortInfo.column, null, null, decryptedData.sortInfo.reverse);
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
    onEmptySelection: function() {
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
        if (typeof APPNAME == 'undefined' || APPNAME == null) {
            setTimeout(this.getTotalRecord, 1000);
        } else {
            feed.getTypes(function(update) {
                update = update.sort(function(a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                this.setState({
                    types: update,
                    connect: true
                });
            }.bind(this));
        }
    },
    removeType: function(typeName) {
        feed.deleteData(typeName, function(data) {
            this.resetData();
        }.bind(this));
    },
    componentWillMount: function() {
        this.apply_other();
        if(window.location.href.indexOf('#?input_state') !== -1 || window.location.href.indexOf('?default=true') !== -1) {
            this.setState({
                splash: false
            });
        }
    },
    componentDidMount: function() {
        // add a safe delay as app details are fetched from this
        // iframe's parent function.
        if(!this.state.splash) {
            this.afterConnect();
            input_state = JSON.parse(JSON.stringify(config));
            createUrl(input_state);
        }
        this.setApps();
    },
    apply_other: function() {
        if(typeof BRANCH != 'undefined') {
            if(BRANCH === 'master') {
                this.setIndices();
            }
        }
    },
    // BRANCH: MASTER
    setIndices: function() {
        var es_host = document.URL.split('/_plugin/')[0];
        var getIndices = feed.getIndices(es_host);
        if(getIndices) {
            getIndices.then(function (data) {
                var historicApps = this.getApps();
                for(indice in data.indices) {
                    if(historicApps && historicApps.length) {
                        historicApps.forEach(function(old_app, index) {
                            if(old_app.appname === indice) {
                                historicApps.splice(index, 1);
                            }
                        })
                    }
                    var obj = {
                        appname: indice,
                        url: es_host
                    };
                    historicApps.push(obj);
                }
                this.setState({
                    historicApps: historicApps,
                    url: es_host
                });
                window.localStorage.setItem('historicApps', JSON.stringify(historicApps));
            }.bind(this));
        }
    },
    afterConnect: function() {
        if(appAuth) {
            //Set filter from url
            if(decryptedData.filterInfo) {
                decryptedData.filterInfo.applyFilter = this.applyFilter;
                this.setState({
                    filterInfo: decryptedData.filterInfo
                });
            }

            //Set hidden columns from url
            if(decryptedData.hiddenColumns) {
                this.setState({
                    hiddenColumns: decryptedData.hiddenColumns
                });
            }

            //Set visible columns from url
            if(decryptedData.visibleColumns) {
                this.setState({
                    visibleColumns: decryptedData.visibleColumns
                });
            }

            setTimeout(this.setMap, 2000)
            setTimeout(this.getStreamingTypes, 2000);
            // call every 1 min.
            mappingInterval = setInterval(this.setMap, 60 * 1000);
            streamingInterval = setInterval(this.getStreamingTypes, 60 * 1000);
            this.getTotalRecord();

            this.setState({
                url: config.url
            });
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

        //set url
        input_state.visibleColumns = visibleColumns;
        input_state.hiddenColumns = [];
        createUrl(input_state);
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
            if (typeof APPNAME == 'undefined' || APPNAME == null) {
                setTimeout(this.getTotalRecord, 1000);
            } else {
                feed.getTotalRecord().on('data', function(data) {
                    var infoObj = $this.state.infoObj;
                    infoObj.getOnce = true;
                    infoObj.availableTotal = data.hits.total;
                    $this.setState({
                        infoObj: infoObj
                    });
                });
            }
        }
    },
    watchStock: function(typeName) {
        //Remove sorting while slecting new type
        this.setState({
            sortInfo: {
                active: false
            }
        });

        //Remove sortInfo from store
        if(input_state.hasOwnProperty('sortInfo')) {
            delete input_state.sortInfo;
            createUrl(input_state);
        }
        window.stop();
        subsetESTypes.push(typeName);
        this.applyGetStream();
        input_state.selectedType = subsetESTypes;
        createUrl(input_state);
    },
    unwatchStock: function(typeName) {
        //Remove sorting while unslecting type
        this.setState({
            sortInfo: {
                active: false
            }
        });

        //Remove sortInfo from store
        if(input_state.hasOwnProperty('sortInfo')) {
            delete input_state.sortInfo;
            createUrl(input_state);
        }
        subsetESTypes.splice(subsetESTypes.indexOf(typeName), 1);
        this.removeType(typeName);
        input_state.selectedType = subsetESTypes;
        createUrl(input_state);
        this.watchSelectedRecord();
        this.applyGetStream();
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
                if(!getMapFlag) {
                    $this.setApps(true);
                    getMapFlag = true;
                }
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
        if (subsetESTypes.length && infoObj.showing < infoObj.searchTotal && scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight - 100 && !this.state.pageLoading) {
                this.setState({
                    pageLoading: true
                });
                this.paginateData();
        }
    },
    handleSort: function(item, type, eve, order) {
        if(!order) {
            order = help.getOrder(item);
        }
        var storObj = {
            active: true,
            column: item,
            reverse: order
        };
        this.setState({
            sortInfo: storObj
        });

        //Store state of sort
        if(decryptedData.sortInfo)
            delete decryptedData.sortInfo;
        var sort_state = JSON.parse(JSON.stringify(storObj));
        input_state.sortInfo = sort_state;
        createUrl(input_state);

        var docs = this.state.documents;
        var sortedArray = help.sortIt(docs, item, order);
        this.setState({
            documents: sortedArray
        });
    },
    addRecord: function(editorref) {
        var form = $('#addObjectForm').serializeArray();
        var obj = {
            name: 'body',
            value: editorref.getValue().trim()
        };
        form.push(obj);
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
    getTypeDoc: function(editorref) {
        var selectedType = $('#setType').val();
        var typeDocSample = this.state.typeDocSample;
        var $this = this;
        if (selectedType != '' && selectedType != null && typeDocSample) {
            if (typeDocSample.hasOwnProperty(selectedType)) {

                feed.getSingleDoc(selectedType, function(data) {
                    try {
                        typeDocSample[selectedType] = data.hits.hits[0]._source;
                        $this.setState({
                            typeDocSample: typeDocSample
                        });
                        $this.showSample(typeDocSample[selectedType], editorref);
                    }
                    catch (err) {
                        console.log(err);
                    }
                });

            } else this.showSample(typeDocSample[selectedType], editorref);
        }
    },
    userTouchFlag: false,
    //If user didn't touch to textarea only then show the json
    showSample: function(obj, editorref) {
        if(this.userTouchFlag && editorref.getValue().trim() != ''){}
        else{
            var convertJson = obj.hasOwnProperty('json') ? obj.json : obj;
            var objJson = JSON.stringify(convertJson, null, 2);
            editorref.setValue(objJson);
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

        //Store state of filter
        var filter_state = JSON.parse(JSON.stringify(filterObj));
        delete filter_state.applyFilter;
        input_state.filterInfo = filter_state;
        createUrl(input_state);

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
        this.removeSelection();
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


        //Remove filterinfo from store
        if(input_state.hasOwnProperty('filterInfo')) {
            delete input_state.filterInfo;
            createUrl(input_state);
        }

        sdata = [];
        $this.resetData();
        setTimeout(function() {
            $this.getStreamingData(subsetESTypes);
        }, 500);
        this.removeSelection();
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

        //Remove sortInfo from store
        if(input_state.hasOwnProperty('sortInfo')) {
            delete input_state.sortInfo;
            createUrl(input_state);
        }
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

                //set url
                input_state.visibleColumns = visibleColumns;
                input_state.hiddenColumns = hiddenColumns;
                createUrl(input_state);
            },
            setVisibleColumn: function() {

            }
        };
        return obj;
    },
    selectRecord: function(id, type, row, currentCheck) {
        var selection = help.selectRecord(this.state.actionOnRecord, id, type, row, currentCheck, this.state.documents);
        this.setState({
            actionOnRecord: selection.actionOnRecord
        });
        this.forceUpdate();
    },
    removeSelection: function() {
        var selection = help.removeSelection(this.state.actionOnRecord, this.state.documents);
        selection.actionOnRecord.selectToggle = false;
        this.setState({
            actionOnRecord: selection.actionOnRecord
        });
        this.forceUpdate();
        $('[name="selectRecord"]').removeAttr('checked');
    },
    watchSelectedRecord: function() {
        var actionOnRecord = this.state.actionOnRecord;
        actionOnRecord.selectedRows = _.filter(this.state.actionOnRecord.selectedRows, function(row) {
            var flag = subsetESTypes.indexOf(row._type) === -1 ? false : true;
            return flag;
        });
        if(!actionOnRecord.selectedRows.length) {
            this.removeSelection();
        }
        else {
            this.setState({
                actionOnRecord: actionOnRecord
            });
            this.forceUpdate();
        }
    },
    selectToggleChange: function(checkbox) {
        var actionOnRecord = help.selectAll(checkbox, this.state.actionOnRecord, this.state.documents);
        actionOnRecord.selectToggle = checkbox;
        this.setState({
            actionOnRecord: actionOnRecord
        });
        this.forceUpdate();
    },
    getUpdateObj: function() {
        var actionOnRecord = this.state.actionOnRecord;
        var current_selected_row = actionOnRecord.selectedRows[0];
        var current_row = _.filter(this.state.documents, function(ele) {
            return ele._type == current_selected_row._type && ele._id == current_selected_row._id;
        });
        actionOnRecord.row = JSON.stringify(current_row[0].json, null, 4);
        this.setState({
            actionOnRecord: actionOnRecord
        });
    },
    updateRecord: function(json) {
        var form = $('#updateObjectForm').serializeArray();
        var obj = {
            name: 'body',
            value: json
        };
        form.push(obj);
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
        var temp_config = {
            url: '',
            appname: ''
        };
        formInfo.forEach(function(v) {
            if(v.value === '') {
                reloadFlag = false;
            }
            if(v.name == 'url'){
                temp_config.url = v.value;
            }
            else{
                temp_config.appname = v.value;
            }
        });

        if(typeof BRANCH != 'undefined'  && BRANCH === 'master') {
            checkIndex();
        } else {
            letsConnect();
        }

        // BRANCH: MASTER
        // check if index exists or not, and create index if not exists
        function checkIndex() {
            feed.checkIndex(temp_config.url, temp_config.appname).done(function(data) {
                console.log(data);
                letsConnect();
            }).error(function(xhr){
                if(xhr.status === 404){
                    var r = confirm('Index not found, Do you want to create index '+temp_config.appname+'?');
                    if(r) {
                        feed.createIndex(temp_config.url, temp_config.appname).done(function(data) {
                            letsConnect();
                        });
                    }
                } else {
                    letsConnect();
                }
            });
        }
        function letsConnect() {
            window.localStorage.setItem('esurl',temp_config.url);
            window.localStorage.setItem('appname',temp_config.appname);
            location.reload();
        }
    },
    connectPlayPause: function() {
        var reloadFlag = true;
        var formInfo = $('#init-ES').serializeArray();
        formInfo.forEach(function(v) {
            if(v.value.trim() === '') {
                reloadFlag = false;
            }
        });
        if(!reloadFlag) {
            alert('Url or appname should not be empty.');
        } else {
            var connectToggle = this.state.connect ? false: true;
            window.location.href = "#?input_state=''";
            if(connectToggle) {
                this.initEs();
            }
            else {
                subsetESTypes = [];
                this.setState({
                    connect: connectToggle,
                    documents: [],
                    types: [],
                    infoObj: {
                        showing: 0,
                        total: 0,
                        getOnce: false,
                        availableTotal: 0,
                        searchTotal: 0,
                        userTouchAdd: this.userTouchAdd
                    }
                });
            }
        }
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
    exportJsonData: function() {
        $('.json-spinner').show();

        var activeQuery = {
            "query": {
                "match_all": {}
            },
            "size":1000
        };
        if (this.state.filterInfo.active) {
            var filterInfo = this.state.filterInfo;
            activeQuery = feed.createFilterQuery(filterInfo.method, filterInfo.columnName, filterInfo.value, filterInfo.type, filterInfo.analyzed);
        }
        this.scrollApi({"activeQuery": activeQuery});
    },
    scrollApi: function(info) {
        feed.scrollapi(subsetESTypes, info.activeQuery, info.scroll, info.scroll_id).done(function(data){
            var hits = data.hits.hits;
            exportJsonData = exportJsonData.concat(hits);
            if(hits.length > 999) {
                var scrollObj = {
                    'scroll': '1m',
                    'scroll_id': data._scroll_id
                };
                this.scrollApi({"activeQuery": scrollObj, "scroll": true, "scroll_id": data._scroll_id});
            }
            else {
                var str = JSON.stringify(exportJsonData, null, 4);
                var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
                var link = document.getElementById('jsonlink').href = dataUri;
                $('.json-spinner').hide();
                $('#jsonlink').removeClass('hide');
                exportJsonData = [];
            }
        }.bind(this));
    },
    getApps: function() {
        var apps = window.localStorage.getItem('historicApps');
        if(apps) {
            try {
                apps = JSON.parse(apps);
            } catch(e) {
                apps = [];
            }
        } else {
            apps = [];
        }
        return apps;
    },
    setApps: function(authFlag) {
        var app = {
            url: config.url,
            appname: config.appname
        };
        var historicApps = this.getApps();
        if(authFlag) {
            if(historicApps && historicApps.length) {
                historicApps.forEach(function(old_app, index) {
                    if(old_app.appname === app.appname) {
                        historicApps.splice(index, 1);
                    }
                })
            }
            if(app.url) {
                historicApps.push(app);
            }
        }
        this.setState({
            historicApps: historicApps
        });
        window.localStorage.setItem('historicApps', JSON.stringify(historicApps));
    },
    setConfig: function(url) {
        this.setState({ url: url});
        this.setState({
            connect: false
        });
    },
    valChange: function(event) {
        this.setState({ url: event.target.value});
    },
    hideUrlChange: function() {
        var hideUrl = this.state.hideUrl ? false : true;
        this.setState({
            hideUrl: hideUrl
        });
    },
    //The homepage is built on two children components(which may
    //have other children components). TypeTable renders the
    //streaming types and DataTable renders the streaming documents.
    //main.js ties them together.

    render: function() {
        var EsForm = !this.state.splash ? 'col-xs-12 init-ES': 'col-xs-12 EsBigForm';
        var esText = !this.state.splash ? (this.state.connect ? 'Disconnect':'Connect'): 'Start Browsing';
        var esBtn = this.state.connect ? 'btn-primary ': '';
        esBtn += 'btn btn-default submit-btn';
        var shareBtn = this.state.connect ? 'share-btn': 'hide';
        var url = this.state.url;
        var opts = {};
        var playClass = 'ib fa fa-play';
        var pauseClass = 'hide fa fa-pause';
        if(this.state.connect) {
            opts['readOnly'] = 'readOnly';
            playClass = 'hide fa fa-play';
            pauseClass = 'ib fa fa-pause';
        }
        var hideEye = {'display': this.state.splash ? 'none': 'block'};
        var hideUrl = this.state.hideUrl ? 'hide-url expand' : 'hide-url collapse';
        var hideUrlText = this.state.hideUrl ? React.createElement('span', {className: 'fa fa-eye-slash'}, null): React.createElement('span', {className: 'fa fa-eye'}, null);

        return (<div>
                    <div id='modal' />
                    <div className="row dejavuContainer">
                        <form className={EsForm} id="init-ES">
                            <div className="vertical0">
                                <div className="vertical1">
                                    <div className="esContainer">
                                        <div className="img-container">
                                            <img src="assets/img/icon.png" />
                                        </div>
                                        <div>
                                          <h1>Déjà vu</h1>
                                          <h4 className="mb-25">The missing Web UI for Elasticsearch</h4>
                                        </div>
                                        <ShareLink btn={shareBtn}> </ShareLink>
                                        <div className="splashIn">
                                            <div className="form-group m-0 col-xs-4 pd-0 pr-5">
                                                <AppSelect connect={this.state.connect} splash={this.state.splash} setConfig={this.setConfig} apps={this.state.historicApps} />
                                            </div>
                                            <div className="col-xs-8 m-0 pd-0 pr-5 form-group">
                                                <div className="url-container">
                                                    <input type="text" className="form-control" name="url" placeholder="URL for cluster goes here. e.g.  https://username:password@scalr.api.appbase.io"
                                                        value={url}
                                                        onChange={this.valChange}  {...opts} />
                                                      <span className={hideUrl} style={hideEye}>
                                                        <a className="btn btn-default"
                                                            onClick={this.hideUrlChange}>
                                                            {hideUrlText}
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="submit-btn-container">
                                            <a className={esBtn} onClick={this.connectPlayPause}>
                                                <i className={playClass}></i>
                                                <i className={pauseClass}></i>
                                                {esText}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
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
                                reloadData={this.reloadData}
                                exportJsonData= {this.exportJsonData} />
                        </div>
                        <footer className="text-center">
                            <a href="http://appbaseio.github.io/dejaVu">Watch Video</a>
                            <span className="text-right pull-right powered_by">
                                Create your <strong>Elasticsearch</strong> in cloud with&nbsp;<a href="http://appbase.io">appbase.io</a>
                            </span>
                            <span className="pull-left github-star">
                                <iframe src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=dejaVu&type=star&count=true" frameBorder="0" scrolling="0" width="120px" height="20px"></iframe>
                            </span>
                        </footer>
                        <FeatureComponent.ErrorModal
                            errorShow={this.state.errorShow}
                            closeErrorModal = {this.closeErrorModal}>
                        </FeatureComponent.ErrorModal>
                    </div>
                </div>);
    }
});

module.exports = HomePage;
