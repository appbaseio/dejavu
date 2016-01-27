// This file contains all the logic for your app
// authentication and streaming data from your
// endpoint.


// **Configs:** Appname and Credentials
const HOSTNAME = "scalr.api.appbase.io"
const DATA_SIZE = 20;
var APPNAME, USERNAME, PASSWORD;
var appbaseRef;
var getMapFlag = false;

parent.globalAppData(function(res) {
    APPNAME = res.appname;
    APPID = res.appid;
    USERNAME = res.username;
    PASSWORD = res.password;
    EMAIL = res.email;
    PROFILE = res.profile;
    console.log(PROFILE);
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
var dataOffset = 0; // pagination offset

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
                    setTotal(res.hits.total);
                    dataOffset += DATA_SIZE;
                    if (res.hits.hits.length == 0) {
                        callback(null, 0);
                    } else {
                        callback(res.hits.hits);
                    }
                }).on('error', function(err) {
                    console.log("caught a retrieval error", err);
                })
                
                //Stop old stream
                if(typeof streamRef != 'undefined')
                    streamRef.stop();
                
                // get new data updates
                var streamRef = appbaseRef.searchStream({
                    type: types,
                    body: queryBody,
                }).on('data', function(res) {
                    callback(res, true);
                }).on('error', function(err) {
                    console.log("caught a stream error", err);
                });
        }
    }
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
            dataOffset += DATA_SIZE;
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
            if (dataOffset >= DATA_SIZE && dataOffset % DATA_SIZE === 0) {
                if (queryBody != null)
                    paginationSearch(subsetESTypes, dataOffset, callback, queryBody)
                else
                    paginationSearch(subsetESTypes, dataOffset, callback)
            }
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
        indexData: function(recordObject, callback) {
            console.log(recordObject);
            appbaseRef.index(recordObject).on('data', function(res) {
                if (callback)
                    callback();
            });
        },
        deleteRecord:function(selectedRows, callback){
            var deleteArray = selectedRows.map( v => ({"delete":v}) );
            console.log(deleteArray);
            
            appbaseRef.bulk({
                body:deleteArray
            }).on('data',function(data){
                var localSdata = [];
                for (data in sdata) {
                    if (sdata[data]._type == type && sdata[data]._id == id){
                        console.log('me');
                    }
                    else{
                        localSdata[data] = sdata[data];
                    }
                }
                sdata = localSdata;
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
