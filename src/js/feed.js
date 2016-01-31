// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.


// **Configs:** Appname and Credentials
const HOSTNAME = "scalr.api.appbase.io"
const DATA_SIZE = 20;
var APPNAME, USERNAME, PASSWORD;
var appbaseRef;
var getMapFlag = false;
var OperationFlag = false;

parent.globalAppData(function(res) {
    APPNAME = res.appname;
    APPID = res.appid;
    USERNAME = res.username;
    PASSWORD = res.password;
    EMAIL = res.email;
    PROFILE = res.profile;
    init();
    APPURL = 'https://' + USERNAME + ':' + PASSWORD + '@scalr.api.appbase.io/' + APPNAME;
});

function init() {
    // Instantiating appbase ref with the global configs defined above.
    appbaseRef = new Appbase({
        url: 'https://' + HOSTNAME,
        appname: APPNAME,
        username: USERNAME,
        password: PASSWORD
    });
}

// vars for tracking current data and types
var sdata = {}; // data to be displayed in table
var headers = ["_type", "_id"];
var esTypes = []; // all the types in current 'app'
var subsetESTypes = []; // currently 'selected' types

var feed = (function() {

    // applies a searchStream() query on a particular ``type``
    // to establish a continuous query connection.
    function applyStreamSearch(types, callback, queryBody, setTotal) {
        if (types !== null) {
            var defaultQueryBody = {
                query: {
                    match_all: {}
                }
            }

            var queryBody = queryBody ? queryBody : defaultQueryBody;

            // get historical data
            appbaseRef.search({
                    type: types,
                    from: 0,
                    size: DATA_SIZE,
                    body: queryBody
                }).on('data', function(res) {
                    if (res.hits.hits.length == 0) {
                        callback(null, 0);
                    } else {
                        callback(res.hits.hits);
                    }
                    allowOtherOperation();
                }).on('error', function(err) {
                    console.log("caught a retrieval error", err);
                    allowOtherOperation();
                })

                // Counter stream
                countStream(types, setTotal);

                //Stop old stream
                if(typeof streamRef != 'undefined')
                    streamRef.stop();

                // get new data updates
                streamRef = appbaseRef.searchStream({
                    type: types,
                    body: queryBody
                }).on('data', function(res) {
                    if(res.hasOwnProperty('_updated'))
                        delete res._updated;
                    callback(res, true);
                }).on('error', function(err) {
                    console.log("caught a stream error", err);
                });
        }
    };

    //This function is built only to maintain the total number of records
    //It's hard to figure out correct total number of records while streaming and filtering is together
    function countStream(types, setTotal){
        appbaseRef.search({
            type: types,
            body: {"query":{"match_all":{}}}
        }).on('data', function(res) {
            setTotal(res.hits.total);
        });

        //Stop old stream
        if(typeof counterStream != 'undefined')
            counterStream.stop();

        counterStream = appbaseRef.searchStream({
            type: types,
            body: {"query":{"match_all":{}}}
        }).on('data', function(res2) {
            //For update data
            if(res2._updated){

            }
            //For Index data
            else {
                setTotal(0, true, 'index');
            }
            //callback(res, true);
        }).on('error', function(err) {
            //console.log("caught a stream error", err);
        });
    };

    function allowOtherOperation(){
        setTimeout(() => {
            OperationFlag = false;
        },500);
    };

    // paginate and show new results when user scrolls
    // to the bottom of the existing results.
    function paginationSearch(typeName, from, callback, queryBody) {
        if (typeName !== null)
            var defaultQueryBody = {
                query: {
                    match_all: {}
                }
            }
        var queryBody = queryBody ? queryBody : defaultQueryBody;
        appbaseRef.search({
            type: typeName,
            from: from,
            size: DATA_SIZE,
            body: queryBody
        }).on('data', function(res) {
            callback(res.hits.hits);
        })
    }

    return {
        // exposes ``applyStreamSearch()`` as ``getData()``
        getData: function(types, callback, setTotal) {
            applyStreamSearch(types, callback, false, setTotal);
        },
        // ``deleteData()`` deletes the data records when
        // a type is unchecked by the user.
        deleteData: function(typeName, callback) {
            localSdata = {};
            for (data in sdata) {
                if (sdata[data]._type !== typeName){
                    localSdata[data] = sdata[data];
                }
            }
            sdata = localSdata;
            callback(sdata);
        },
        // ``paginateData()`` finds new results from the data offset.
        paginateData: function(callback, queryBody) {
            if (queryBody != null)
                paginationSearch(subsetESTypes, Object.keys(sdata).length, callback, queryBody)
            else
                paginationSearch(subsetESTypes, Object.keys(sdata).length, callback)
        },
        // gets all the types of the current app;
        getTypes: function(callback) {
            if (typeof APPNAME != 'undefined') {
                appbaseRef.getTypes().on('data', function(res) {
                    var types = res.filter(function(val) {
                        return val[0] !== '.'
                    });
                    if (JSON.stringify(esTypes) !== JSON.stringify(types)) {
                        esTypes = types.slice();
                        callback(types);
                    }
                }).on('error', function(err) {
                    console.log('error in retrieving types: ', err)
                })
            } else {
                var $this = this;
                setTimeout(function() {
                    $this.getTypes(callback);
                }, 1000);
            }
        },
        indexData: function(recordObject, method, callback) {
            if(method == 'index'){
                appbaseRef.index(recordObject).on('data', function(res) {
                    if (callback)
                        callback();
                });
            }
            else{
                var doc = recordObject.body;
                recordObject.body = {doc:doc};
                console.log(recordObject);
                appbaseRef.update(recordObject).on('data', function(res) {
                    if (callback)
                        callback();
                });
            }

        },
        deleteRecord:function(selectedRows, callback){
            var deleteArray = selectedRows.map( v => ({"delete":v}) );
            console.log(deleteArray);

            appbaseRef.bulk({
                body:deleteArray
            }).on('data',function(data){
                for (data in sdata) {
                    selectedRows.forEach((v)=>{
                        if(typeof sdata[data] != 'undefined'){
                            if (sdata[data]._type == v._type && sdata[data]._id == v._id){
                                delete sdata[data];
                            }
                        }
                    });
                }
                callback(sdata);
            });
        },
        getSingleDoc: function(type, callback) {
            appbaseRef.search({
                type: type,
                from: 0,
                size: 1,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            }).on('data', function(data) {
                callback(data);
            });
        },
        getMapping: function() {
            var APPURL = 'https://' + USERNAME + ':' + PASSWORD + '@' + HOSTNAME + '/' + APPNAME;
            var createUrl = APPURL + '/_mapping';
            return $.ajax({
                type: 'GET',
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "Basic " + btoa(USERNAME + ':' + PASSWORD));
                },
                url: createUrl,
                xhrFields: {
                    withCredentials: true
                }
            });
        },
        testQuery:function(types, queryBody){
            // get historical data
            return appbaseRef.search({
                    type: types,
                    from: 0,
                    size: 0,
                    body: queryBody
                });
        },
        getTotalRecord:function(){
            // get historical data
            return appbaseRef.search({
                    from: 0,
                    size: 0,
                    type:[],
                    body:{query:{match_all:{}}}
                });
        },
        filterQuery: function(method, columnName, value, typeName, callback, setTotal) {
            var queryBody = this.createFilterQuery(method, columnName, value, typeName);
            applyStreamSearch(typeName, callback, queryBody, setTotal);
        },
        //Create Filter Query by passing attributes
        createFilterQuery: function(method, columnName, value, typeName) {
            var queryBody = {};
            switch (method) {
                case 'has':
                    var queryMaker = [];
                    value.forEach(function(val) {
                        var termObj = {};
                        termObj[columnName] = val.trim();
                        var obj = {
                            'term': termObj
                        };
                        queryMaker.push(obj);
                    });
                    queryBody = {
                        "query": {
                            "bool": {
                                "should": queryMaker,
                                "minimum_should_match": 1
                            }
                        }
                    }
                    break;

                case 'has not':
                    var queryMaker = [];
                    value.forEach(function(val) {
                        var termObj = {};
                        termObj[columnName] = val.trim();
                        var obj = {
                            'term': termObj
                        };
                        queryMaker.push(obj);
                    });
                    queryBody = {
                        "query": {
                            "bool": {
                                "must_not": queryMaker,
                                "minimum_should_match": 1
                            }
                        }
                    }
                    break;

                case 'search':
                    var queryMaker = [];
                    var termObj = {};
                    termObj[columnName] = value[0].trim();
                    queryBody = {
                        "query": {
                            "match": termObj
                        }
                    };
                    break;

                case 'greater than':
                    termObj = {};
                    termObj[columnName] = {};
                    termObj[columnName] = {
                        "gte": value[0]
                    };
                    queryBody = {
                        "query": {
                            "range": termObj
                        }
                    };
                    break;

                case 'less than':
                    termObj = {};
                    termObj[columnName] = {};
                    termObj[columnName] = {
                        "lte": value[0]
                    };
                    queryBody = {
                        "query": {
                            "range": termObj
                        }
                    };
                    break;
            }
            return queryBody;
        }
    };




}());
